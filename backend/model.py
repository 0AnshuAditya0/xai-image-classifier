import torch
import os
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
from captum.attr import LayerGradCam
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
import urllib.request
from torch.nn.functional import interpolate
import warnings

warnings.filterwarnings('ignore')

torch.backends.cudnn.benchmark = True
torch.set_float32_matmul_precision('high')

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def denormalize(tensor):
    mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1).to(tensor.device)
    std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1).to(tensor.device)
    tensor = tensor * std + mean
    tensor = torch.clamp(tensor, 0, 1)
    return tensor

def fgsm_attack(image, epsilon, data_grad):
    sign_data_grad = data_grad.sign()
    perturbed_image = image + epsilon * sign_data_grad
    return perturbed_image

class ImageClassifier:
    
    def __init__(self):
        self.device = DEVICE
        self.model, self.labels = self._load_model_and_labels()
        self.gradcam = LayerGradCam(self.model, self.model.layer4[-1])
        self.transform = transforms.Compose([
            transforms.Resize((224, 224), interpolation=transforms.InterpolationMode.BILINEAR),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    
    def _load_model_and_labels(self):
        model_path = os.path.join(os.path.dirname(__file__), "..", "model", "xai_resnet18.pth")
        print(f"🚀 Loading custom ResNet18 model from {model_path}...")
        
        try:
            checkpoint = torch.load(model_path, map_location=self.device)
            labels = checkpoint.get('class_names', ['Class ' + str(i) for i in range(10)])
            
            model = models.resnet18(weights=None)
            model.fc = nn.Linear(model.fc.in_features, len(labels))
            
            state_dict = checkpoint.get('model_state_dict', checkpoint)
            model.load_state_dict(state_dict)
            model.eval().to(self.device)
            
            if self.device.type == 'cuda':
                model = model.half()
                print("✅ Model optimized with FP16 precision")
            
            self.model_type = "ResNet18 (Custom)"
            print(f"✅ Model loaded successfully with {len(labels)} classes!")
            return model, labels
        except Exception as e:
            print(f"❌ Error loading custom model: {e}")
            print("⚠️ Falling back to ResNet152 ImageNet model...")
            self.model_type = "ResNet152 (Generic)"
            model = models.resnet152(weights='IMAGENET1K_V2')
            model.eval().to(self.device)
            url = "https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt"
            labels = [line.decode('utf-8').strip() for line in urllib.request.urlopen(url).readlines()]
            return model, labels
    
    def predict_and_explain(self, image: Image.Image, enable_attack: bool = False, attack_strength: float = 0.05):
        img_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        original_tensor = img_tensor.clone()
        original_tensor.requires_grad = True

        if self.device.type == 'cuda':
            self.model.float()
            original_tensor = original_tensor.float()

        output = self.model(original_tensor)
        probabilities = torch.softmax(output, dim=1)
        num_to_show = min(10, len(self.labels))
        top_prob, top_idx = torch.topk(probabilities, num_to_show)
        original_pred_class = top_idx[0][0].item()

        if enable_attack:
            loss = nn.CrossEntropyLoss()(output, torch.tensor([original_pred_class]).to(self.device))
            self.model.zero_grad()
            loss.backward()
            data_grad = original_tensor.grad.data
            
            perturbed_tensor = fgsm_attack(original_tensor, attack_strength, data_grad)
            
            output = self.model(perturbed_tensor)
            probabilities = torch.softmax(output, dim=1)
            top_prob, top_idx = torch.topk(probabilities, num_to_show)
            
            img_tensor = perturbed_tensor.detach()
            
            denorm_img = denormalize(img_tensor.squeeze(0)).cpu().numpy().transpose(1, 2, 0)
            vis_image = (denorm_img * 255).astype(np.uint8)
            pil_vis_image = Image.fromarray(vis_image)
        else:
            vis_image = np.array(image.resize((224, 224)))
            pil_vis_image = image
            img_tensor = img_tensor.detach()

        pred_class = top_idx[0][0].item()
        confidence = top_prob[0][0].item()
        
        grad_tensor = img_tensor.float() if self.device.type == 'cuda' else img_tensor
        attributions = self.gradcam.attribute(grad_tensor, target=pred_class)
        attr_resized = interpolate(attributions, size=(224, 224), mode='bilinear', align_corners=False)
        attr_np = attr_resized.squeeze().cpu().detach().numpy()
        attr_np = (attr_np - attr_np.min()) / (attr_np.max() - attr_np.min() + 1e-8)
        
        if self.device.type == 'cuda':
            self.model.half()

        main_viz = self._create_main_visualization(vis_image, attr_np, top_prob, top_idx, pred_class, confidence)
        detailed_viz = self._create_detailed_heatmap(vis_image, attr_np)
        
        top_predictions = [
            {
                "class": self.labels[idx.item()],
                "confidence": prob.item() * 100
            }
            for prob, idx in zip(top_prob[0], top_idx[0])
        ]
        
        return {
            "prediction": {
                "class": self.labels[pred_class],
                "confidence": confidence * 100,
                "top_predictions": top_predictions
            },
            "visualizations": {
                "main": main_viz,
                "detailed": detailed_viz,
                "perturbed_image": pil_vis_image if enable_attack else None
            },
            "metadata": {
                "precision": "FP16 (GPU)" if self.device.type == 'cuda' else "FP32 (CPU)",
                "device": str(self.device),
                "adversarial_attack_active": enable_attack,
                "original_prediction": self.labels[original_pred_class] if enable_attack else None,
                "model_architecture": self.model_type
            }
        }
    
    def _create_main_visualization(self, image, attr_np, top_prob, top_idx, pred_class, confidence):
        fig = plt.figure(figsize=(24, 14))
        fig.patch.set_facecolor('#0a0a0a')
        
        gs = fig.add_gridspec(2, 3, height_ratios=[2, 1], hspace=0.3, wspace=0.15)
        
        ax1 = fig.add_subplot(gs[0, 0])
        ax2 = fig.add_subplot(gs[0, 1])
        ax3 = fig.add_subplot(gs[0, 2])
        ax4 = fig.add_subplot(gs[1, :])
        
        ax1.imshow(image)
        ax1.set_title("Input Image", fontsize=18, fontweight='700', color='#e0e0e0', pad=20)
        ax1.axis('off')
        
        im = ax2.imshow(attr_np, cmap='jet', interpolation='bilinear')
        ax2.set_title("Grad-CAM Heatmap", fontsize=18, fontweight='700', color='#e0e0e0', pad=20)
        ax2.axis('off')
        cbar = plt.colorbar(im, ax=ax2, fraction=0.046, pad=0.04)
        cbar.ax.tick_params(labelsize=12, colors='#a0a0a0')
        cbar.set_label('Importance', rotation=270, labelpad=25, color='#e0e0e0', fontsize=13, fontweight='600')
        
        ax3.imshow(image)
        ax3.imshow(attr_np, cmap='jet', alpha=0.5, interpolation='bilinear')
        ax3.set_title(f"AI Focus: {self.labels[pred_class]}", fontsize=18, fontweight='700', color='#e0e0e0', pad=20)
        ax3.axis('off')
        
        num_to_show = top_idx.shape[1]
        top_labels = [self.labels[idx.item()] for idx in top_idx[0]]
        top_probs = [prob.item() * 100 for prob in top_prob[0]]
        
        colors = ['#10b981' if i == num_to_show-1 else '#3b82f6' if i >= num_to_show-3 else '#8b5cf6' for i in range(num_to_show)]
        bars = ax4.barh(range(num_to_show), top_probs[::-1], color=colors[::-1], edgecolor='#1a1a1a', linewidth=2)
        
        ax4.set_yticks(range(num_to_show))
        ax4.set_yticklabels(top_labels[::-1], fontsize=14, color='#e0e0e0', fontweight='600')
        ax4.set_xlabel('Confidence (%)', fontsize=15, color='#e0e0e0', fontweight='700')
        ax4.set_title(f'Top {num_to_show} Predictions', fontsize=19, fontweight='800', color='#e0e0e0', pad=20)
        ax4.set_xlim([0, 100])
        ax4.grid(axis='x', alpha=0.2, color='#404040', linestyle='--')
        ax4.set_facecolor('#0a0a0a')
        ax4.spines['top'].set_visible(False)
        ax4.spines['right'].set_visible(False)
        ax4.spines['left'].set_color('#404040')
        ax4.spines['bottom'].set_color('#404040')
        ax4.tick_params(colors='#a0a0a0', labelsize=13)
        
        for bar, prob in zip(bars, top_probs[::-1]):
            ax4.text(prob + 1.5, bar.get_y() + bar.get_height()/2,
                    f'{prob:.1f}%', va='center', fontsize=13, color='#e0e0e0', fontweight='700')
        
        plt.tight_layout()
        
        buf = BytesIO()
        plt.savefig(buf, format='png', dpi=150, bbox_inches='tight', facecolor='#0a0a0a')
        buf.seek(0)
        result_image = Image.open(buf)
        plt.close(fig)
        
        return result_image
    
    def _create_detailed_heatmap(self, image, attr_np):
        fig, axes = plt.subplots(2, 2, figsize=(20, 18))
        fig.patch.set_facecolor('#0a0a0a')
        
        axes[0, 0].imshow(image)
        axes[0, 0].set_title("Original Form", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        axes[0, 0].axis('off')
        
        axes[0, 1].imshow(image)
        axes[0, 1].imshow(attr_np, cmap='jet', alpha=0.6, interpolation='bilinear')
        axes[0, 1].set_title("Jet Colormap Overlay", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        axes[0, 1].axis('off')
        
        axes[1, 0].imshow(image)
        axes[1, 0].imshow(attr_np, cmap='hot', alpha=0.6, interpolation='bilinear')
        axes[1, 0].set_title("Hot Colormap Overlay", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        axes[1, 0].axis('off')
        
        axes[1, 1].imshow(image)
        axes[1, 1].imshow(attr_np, cmap='viridis', alpha=0.6, interpolation='gaussian')
        axes[1, 1].contour(attr_np, levels=6, colors='white', linewidths=2, alpha=0.9)
        axes[1, 1].set_title("Viridis + Contours", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        axes[1, 1].axis('off')
        
        plt.tight_layout()
        
        buf = BytesIO()
        plt.savefig(buf, format='png', dpi=140, bbox_inches='tight', facecolor='#0a0a0a')
        buf.seek(0)
        detailed_image = Image.open(buf)
        plt.close(fig)
        
        return detailed_image
