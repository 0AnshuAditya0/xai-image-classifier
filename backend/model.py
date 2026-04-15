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

def restore_image(tensor):
    mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1).to(tensor.device)
    std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1).to(tensor.device)
    tensor = tensor * std + mean
    tensor = torch.clamp(tensor, 0, 1)
    return tensor

def apply_stress_test(image, strength, gradient):
    sign = gradient.sign()
    new_image = image + strength * sign
    return new_image

class ImageAnalyzer:
    
    def __init__(self):
        self.device = DEVICE
        self.model, self.labels = self.setup_model()
        self.focus_engine = LayerGradCam(self.model, self.model.layer4[-1])
        self.prepare = transforms.Compose([
            transforms.Resize((224, 224), interpolation=transforms.InterpolationMode.BILINEAR),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    
    def setup_model(self):
        path = os.path.join(os.path.dirname(__file__), "..", "model", "xai_resnet18.pth")
        
        try:
            stored_data = torch.load(path, map_location=self.device)
            labels = stored_data.get('class_names', ['Type ' + str(i) for i in range(10)])
            
            model = models.resnet18(weights=None)
            model.fc = nn.Linear(model.fc.in_features, len(labels))
            
            weights = stored_data.get('model_state_dict', stored_data)
            model.load_state_dict(weights)
            model.eval().to(self.device)
            
            if self.device.type == 'cuda':
                model = model.half()
            
            self.model_name = "Custom Brain"
            return model, labels
        except Exception:
            self.model_name = "Standard Brain"
            model = models.resnet152(weights='IMAGENET1K_V2')
            model.eval().to(self.device)
            url = "https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt"
            labels = [line.decode('utf-8').strip() for line in urllib.request.urlopen(url).readlines()]
            return model, labels
    
    def analyze(self, image: Image.Image, test_stress: bool = False, stress_level: float = 0.05):
        tensor = self.prepare(image).unsqueeze(0).to(self.device)
        
        base_tensor = tensor.clone()
        base_tensor.requires_grad = True

        if self.device.type == 'cuda':
            self.model.float()
            base_tensor = base_tensor.float()

        output = self.model(base_tensor)
        probs = torch.softmax(output, dim=1)
        count = min(10, len(self.labels))
        top_vals, top_ids = torch.topk(probs, count)
        first_pick = top_ids[0][0].item()

        if test_stress:
            loss = nn.CrossEntropyLoss()(output, torch.tensor([first_pick]).to(self.device))
            self.model.zero_grad()
            loss.backward()
            grad = base_tensor.grad.data
            
            tweaked_tensor = apply_stress_test(base_tensor, stress_level, grad)
            
            output = self.model(tweaked_tensor)
            probs = torch.softmax(output, dim=1)
            top_vals, top_ids = torch.topk(probs, count)
            
            tensor = tweaked_tensor.detach()
            
            clean_img = restore_image(tensor.squeeze(0)).cpu().numpy().transpose(1, 2, 0)
            ui_image = (clean_img * 255).astype(np.uint8)
            final_pil = Image.fromarray(ui_image)
        else:
            ui_image = np.array(image.resize((224, 224)))
            final_pil = image
            tensor = tensor.detach()

        picked_id = top_ids[0][0].item()
        score = top_vals[0][0].item()
        
        grad_input = tensor.float() if self.device.type == 'cuda' else tensor
        focus_data = self.focus_engine.attribute(grad_input, target=picked_id)
        resized_focus = interpolate(focus_data, size=(224, 224), mode='bilinear', align_corners=False)
        focus_map = resized_focus.squeeze().cpu().detach().numpy()
        focus_map = (focus_map - focus_map.min()) / (focus_map.max() - focus_map.min() + 1e-8)
        
        if self.device.type == 'cuda':
            self.model.half()

        summary_map = self.draw_summary(ui_image, focus_map, top_vals, top_ids, picked_id, score)
        detail_map = self.draw_details(ui_image, focus_map)
        
        choices = [
            {
                "class": self.labels[idx.item()],
                "confidence": v.item() * 100
            }
            for v, idx in zip(top_vals[0], top_ids[0])
        ]
        
        return {
            "prediction": {
                "class": self.labels[picked_id],
                "confidence": score * 100,
                "top_predictions": choices
            },
            "visualizations": {
                "main": summary_map,
                "detailed": detail_map,
                "perturbed_image": final_pil if test_stress else None
            },
            "metadata": {
                "speed": "Turbo" if self.device.type == 'cuda' else "Standard",
                "engine": str(self.device),
                "stress_active": test_stress,
                "original_pick": self.labels[first_pick] if test_stress else None,
                "ai_type": self.model_name
            }
        }
    
    def draw_summary(self, image, focus, vals, ids, picked, score):
        fig = plt.figure(figsize=(24, 14))
        fig.patch.set_facecolor('#0a0a0a')
        
        grid = fig.add_gridspec(2, 3, height_ratios=[2, 1], hspace=0.3, wspace=0.15)
        
        left = fig.add_subplot(grid[0, 0])
        mid = fig.add_subplot(grid[0, 1])
        right = fig.add_subplot(grid[0, 2])
        bottom = fig.add_subplot(grid[1, :])
        
        left.imshow(image)
        left.set_title("Your Image", fontsize=18, fontweight='700', color='#e0e0e0', pad=20)
        left.axis('off')
        
        map_ui = mid.imshow(focus, cmap='jet', interpolation='bilinear')
        mid.set_title("AI Focus Area", fontsize=18, fontweight='700', color='#e0e0e0', pad=20)
        mid.axis('off')
        bar = plt.colorbar(map_ui, ax=mid, fraction=0.046, pad=0.04)
        bar.ax.tick_params(labelsize=12, colors='#a0a0a0')
        bar.set_label('Focus Level', rotation=270, labelpad=25, color='#e0e0e0', fontsize=13, fontweight='600')
        
        right.imshow(image)
        right.imshow(focus, cmap='jet', alpha=0.5, interpolation='bilinear')
        right.set_title(f"AI Thinking: {self.labels[picked]}", fontsize=18, fontweight='700', color='#e0e0e0', pad=20)
        right.axis('off')
        
        showing = ids.shape[1]
        names = [self.labels[idx.item()] for idx in ids[0]]
        rates = [v.item() * 100 for v in vals[0]]
        
        shades = ['#10b981' if i == showing-1 else '#3b82f6' if i >= showing-3 else '#8b5cf6' for i in range(showing)]
        lines = bottom.barh(range(showing), rates[::-1], color=shades[::-1], edgecolor='#1a1a1a', linewidth=2)
        
        bottom.set_yticks(range(showing))
        bottom.set_yticklabels(names[::-1], fontsize=14, color='#e0e0e0', fontweight='600')
        bottom.set_xlabel('Confidence (%)', fontsize=15, color='#e0e0e0', fontweight='700')
        bottom.set_title(f'Top {showing} Guesses', fontsize=19, fontweight='800', color='#e0e0e0', pad=20)
        bottom.set_xlim([0, 100])
        bottom.grid(axis='x', alpha=0.2, color='#404040', linestyle='--')
        bottom.set_facecolor('#0a0a0a')
        bottom.spines['top'].set_visible(False)
        bottom.spines['right'].set_visible(False)
        bottom.spines['left'].set_color('#404040')
        bottom.spines['bottom'].set_color('#404040')
        bottom.tick_params(colors='#a0a0a0', labelsize=13)
        
        for line, rate in zip(lines, rates[::-1]):
            bottom.text(rate + 1.5, line.get_y() + line.get_height()/2,
                    f'{rate:.1f}%', va='center', fontsize=13, color='#e0e0e0', fontweight='700')
        
        plt.tight_layout()
        
        stream = BytesIO()
        plt.savefig(stream, format='png', dpi=150, bbox_inches='tight', facecolor='#0a0a0a')
        stream.seek(0)
        output_img = Image.open(stream)
        plt.close(fig)
        
        return output_img
    
    def draw_details(self, image, focus):
        fig, quad = plt.subplots(2, 2, figsize=(20, 18))
        fig.patch.set_facecolor('#0a0a0a')
        
        quad[0, 0].imshow(image)
        quad[0, 0].set_title("Original Look", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        quad[0, 0].axis('off')
        
        quad[0, 1].imshow(image)
        quad[0, 1].imshow(focus, cmap='jet', alpha=0.6, interpolation='bilinear')
        quad[0, 1].set_title("Colorful Focus", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        quad[0, 1].axis('off')
        
        quad[1, 0].imshow(image)
        quad[1, 0].imshow(focus, cmap='hot', alpha=0.6, interpolation='bilinear')
        quad[1, 0].set_title("Heat Focus", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        quad[1, 0].axis('off')
        
        quad[1, 1].imshow(image)
        quad[1, 1].imshow(focus, cmap='viridis', alpha=0.6, interpolation='gaussian')
        quad[1, 1].contour(focus, levels=6, colors='white', linewidths=2, alpha=0.9)
        quad[1, 1].set_title("Detailed Map", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        quad[1, 1].axis('off')
        
        plt.tight_layout()
        
        stream = BytesIO()
        plt.savefig(stream, format='png', dpi=140, bbox_inches='tight', facecolor='#0a0a0a')
        stream.seek(0)
        final_img = Image.open(stream)
        plt.close(fig)
        
        return final_img
