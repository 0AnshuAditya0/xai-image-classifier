<<<<<<< HEAD
import torch
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

# Performance optimizations
torch.backends.cudnn.benchmark = True
torch.set_float32_matmul_precision('high')

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class ImageClassifier:
    """ResNet152 Image Classifier with Grad-CAM explainability"""
    
    def __init__(self):
        self.device = DEVICE
        self.model, self.labels = self._load_model_and_labels()
        self.gradcam = LayerGradCam(self.model, self.model.layer4[-1])
        self.transform = transforms.Compose([
            transforms.Resize((224, 224), interpolation=transforms.InterpolationMode.BILINEAR),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    
    @torch.no_grad()
    def _load_model_and_labels(self):
        """Load ResNet152 model with optimizations"""
        print("🚀 Loading ResNet152 model...")
        
        # Load model
        model = models.resnet152(weights='IMAGENET1K_V2')
        model.eval().to(self.device)
        
        # Optimize model for inference
        if self.device.type == 'cuda':
            model = model.half()  # FP16 precision for 2x speedup on GPU
            print("✅ Model optimized with FP16 precision")
        
        # Load ImageNet labels
        url = "https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt"
        response = urllib.request.urlopen(url)
        labels = [line.decode('utf-8').strip() for line in response.readlines()]
        
        print("✅ Model loaded successfully!")
        return model, labels
    
    def predict_and_explain(self, image: Image.Image):
        """
        Predict image class and generate Grad-CAM visualizations
        
        Args:
            image: PIL Image
            
        Returns:
            dict with prediction, visualizations, and metadata
        """
        # Prepare input
        img_tensor = self.transform(image).unsqueeze(0).to(self.device)
        if self.device.type == 'cuda':
            img_tensor = img_tensor.half()
        
        # Inference
        with torch.no_grad():
            output = self.model(img_tensor)
            if self.device.type == 'cuda':
                output = output.float()
            probabilities = torch.softmax(output, dim=1)
        
        top10_prob, top10_idx = torch.topk(probabilities, 10)
        pred_class = top10_idx[0][0].item()
        confidence = top10_prob[0][0].item()
        
        # Generate Grad-CAM
        if self.device.type == 'cuda':
            grad_tensor = img_tensor.float()
        else:
            grad_tensor = img_tensor
            
        attributions = self.gradcam.attribute(grad_tensor, target=pred_class)
        attr_resized = interpolate(attributions, size=(224, 224), mode='bilinear', align_corners=False)
        attr_np = attr_resized.squeeze().cpu().detach().numpy()
        attr_np = (attr_np - attr_np.min()) / (attr_np.max() - attr_np.min() + 1e-8)
        
        # Generate visualizations
        main_viz = self._create_main_visualization(image, attr_np, top10_prob, top10_idx, pred_class, confidence)
        detailed_viz = self._create_detailed_heatmap(image, attr_np)
        
        # Prepare top predictions
        top_predictions = [
            {
                "class": self.labels[idx.item()],
                "confidence": prob.item() * 100
            }
            for prob, idx in zip(top10_prob[0], top10_idx[0])
        ]
        
        return {
            "prediction": {
                "class": self.labels[pred_class],
                "confidence": confidence * 100,
                "top_predictions": top_predictions
            },
            "visualizations": {
                "main": main_viz,
                "detailed": detailed_viz
            },
            "metadata": {
                "precision": "FP16 (GPU)" if self.device.type == 'cuda' else "FP32 (CPU)",
                "device": str(self.device)
            }
        }
    
    def _create_main_visualization(self, image, attr_np, top10_prob, top10_idx, pred_class, confidence):
        """Create main visualization with predictions and heatmap"""
        fig = plt.figure(figsize=(24, 14))
        fig.patch.set_facecolor('#0a0a0a')
        
        gs = fig.add_gridspec(2, 3, height_ratios=[2, 1], hspace=0.3, wspace=0.15)
        
        ax1 = fig.add_subplot(gs[0, 0])
        ax2 = fig.add_subplot(gs[0, 1])
        ax3 = fig.add_subplot(gs[0, 2])
        ax4 = fig.add_subplot(gs[1, :])
        
        # Original image
        ax1.imshow(image)
        ax1.set_title("Original Image", fontsize=18, fontweight='700', color='#e0e0e0', pad=20)
        ax1.axis('off')
        
        # Heatmap
        im = ax2.imshow(attr_np, cmap='jet', interpolation='bilinear')
        ax2.set_title("Grad-CAM Heatmap", fontsize=18, fontweight='700', color='#e0e0e0', pad=20)
        ax2.axis('off')
        cbar = plt.colorbar(im, ax=ax2, fraction=0.046, pad=0.04)
        cbar.ax.tick_params(labelsize=12, colors='#a0a0a0')
        cbar.set_label('Importance', rotation=270, labelpad=25, color='#e0e0e0', fontsize=13, fontweight='600')
        
        # Overlay
        ax3.imshow(image)
        ax3.imshow(attr_np, cmap='jet', alpha=0.5, interpolation='bilinear')
        ax3.set_title(f"AI Focus: {self.labels[pred_class]}", fontsize=18, fontweight='700', color='#e0e0e0', pad=20)
        ax3.axis('off')
        
        # Top 10 predictions bar chart
        top10_labels = [self.labels[idx.item()] for idx in top10_idx[0]]
        top10_probs = [prob.item() * 100 for prob in top10_prob[0]]
        
        colors = ['#10b981' if i == 9 else '#3b82f6' if i >= 7 else '#8b5cf6' for i in range(10)]
        bars = ax4.barh(range(10), top10_probs[::-1], color=colors[::-1], edgecolor='#1a1a1a', linewidth=2)
        
        ax4.set_yticks(range(10))
        ax4.set_yticklabels(top10_labels[::-1], fontsize=14, color='#e0e0e0', fontweight='600')
        ax4.set_xlabel('Confidence (%)', fontsize=15, color='#e0e0e0', fontweight='700')
        ax4.set_title('Top 10 Predictions', fontsize=19, fontweight='800', color='#e0e0e0', pad=20)
        ax4.set_xlim([0, 100])
        ax4.grid(axis='x', alpha=0.2, color='#404040', linestyle='--')
        ax4.set_facecolor('#0a0a0a')
        ax4.spines['top'].set_visible(False)
        ax4.spines['right'].set_visible(False)
        ax4.spines['left'].set_color('#404040')
        ax4.spines['bottom'].set_color('#404040')
        ax4.tick_params(colors='#a0a0a0', labelsize=13)
        
        for bar, prob in zip(bars, top10_probs[::-1]):
            ax4.text(prob + 1.5, bar.get_y() + bar.get_height()/2,
                    f'{prob:.1f}%', va='center', fontsize=13, color='#e0e0e0', fontweight='700')
        
        plt.tight_layout()
        
        # Convert to PIL Image
        buf = BytesIO()
        plt.savefig(buf, format='png', dpi=150, bbox_inches='tight', facecolor='#0a0a0a')
        buf.seek(0)
        result_image = Image.open(buf)
        plt.close(fig)
        
        return result_image
    
    def _create_detailed_heatmap(self, image, attr_np):
        """Create detailed heatmap comparison"""
        fig, axes = plt.subplots(2, 2, figsize=(20, 18))
        fig.patch.set_facecolor('#0a0a0a')
        
        # Original
        axes[0, 0].imshow(image)
        axes[0, 0].set_title("Original Image", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        axes[0, 0].axis('off')
        
        # Jet colormap
        axes[0, 1].imshow(image)
        axes[0, 1].imshow(attr_np, cmap='jet', alpha=0.6, interpolation='bilinear')
        axes[0, 1].set_title("Jet Colormap Overlay", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        axes[0, 1].axis('off')
        
        # Hot colormap
        axes[1, 0].imshow(image)
        axes[1, 0].imshow(attr_np, cmap='hot', alpha=0.6, interpolation='bilinear')
        axes[1, 0].set_title("Hot Colormap Overlay", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        axes[1, 0].axis('off')
        
        # Viridis with contours
        axes[1, 1].imshow(image)
        axes[1, 1].imshow(attr_np, cmap='viridis', alpha=0.6, interpolation='gaussian')
        axes[1, 1].contour(attr_np, levels=6, colors='white', linewidths=2, alpha=0.9)
        axes[1, 1].set_title("Viridis + Contours", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        axes[1, 1].axis('off')
        
        plt.tight_layout()
        
        # Convert to PIL Image
        buf = BytesIO()
        plt.savefig(buf, format='png', dpi=140, bbox_inches='tight', facecolor='#0a0a0a')
        buf.seek(0)
        detailed_image = Image.open(buf)
        plt.close(fig)
        
        return detailed_image
=======
import torch
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

# Performance optimizations
torch.backends.cudnn.benchmark = True
torch.set_float32_matmul_precision('high')

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class ImageClassifier:
    """ResNet152 Image Classifier with Grad-CAM explainability"""
    
    def __init__(self):
        self.device = DEVICE
        self.model, self.labels = self._load_model_and_labels()
        self.gradcam = LayerGradCam(self.model, self.model.layer4[-1])
        self.transform = transforms.Compose([
            transforms.Resize((224, 224), interpolation=transforms.InterpolationMode.BILINEAR),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    
    @torch.no_grad()
    def _load_model_and_labels(self):
        """Load ResNet152 model with optimizations"""
        print("🚀 Loading ResNet152 model...")
        
        # Load model
        model = models.resnet152(weights='IMAGENET1K_V2')
        model.eval().to(self.device)
        
        # Optimize model for inference
        if self.device.type == 'cuda':
            model = model.half()  # FP16 precision for 2x speedup on GPU
            print("✅ Model optimized with FP16 precision")
        
        # Load ImageNet labels
        url = "https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt"
        response = urllib.request.urlopen(url)
        labels = [line.decode('utf-8').strip() for line in response.readlines()]
        
        print("✅ Model loaded successfully!")
        return model, labels
    
    def predict_and_explain(self, image: Image.Image):
        """
        Predict image class and generate Grad-CAM visualizations
        
        Args:
            image: PIL Image
            
        Returns:
            dict with prediction, visualizations, and metadata
        """
        # Prepare input
        img_tensor = self.transform(image).unsqueeze(0).to(self.device)
        if self.device.type == 'cuda':
            img_tensor = img_tensor.half()
        
        # Inference
        with torch.no_grad():
            output = self.model(img_tensor)
            if self.device.type == 'cuda':
                output = output.float()
            probabilities = torch.softmax(output, dim=1)
        
        top10_prob, top10_idx = torch.topk(probabilities, 10)
        pred_class = top10_idx[0][0].item()
        confidence = top10_prob[0][0].item()
        
        # Generate Grad-CAM
        if self.device.type == 'cuda':
            grad_tensor = img_tensor.float()
        else:
            grad_tensor = img_tensor
            
        attributions = self.gradcam.attribute(grad_tensor, target=pred_class)
        attr_resized = interpolate(attributions, size=(224, 224), mode='bilinear', align_corners=False)
        attr_np = attr_resized.squeeze().cpu().detach().numpy()
        attr_np = (attr_np - attr_np.min()) / (attr_np.max() - attr_np.min() + 1e-8)
        
        # Generate visualizations
        main_viz = self._create_main_visualization(image, attr_np, top10_prob, top10_idx, pred_class, confidence)
        detailed_viz = self._create_detailed_heatmap(image, attr_np)
        
        # Prepare top predictions
        top_predictions = [
            {
                "class": self.labels[idx.item()],
                "confidence": prob.item() * 100
            }
            for prob, idx in zip(top10_prob[0], top10_idx[0])
        ]
        
        return {
            "prediction": {
                "class": self.labels[pred_class],
                "confidence": confidence * 100,
                "top_predictions": top_predictions
            },
            "visualizations": {
                "main": main_viz,
                "detailed": detailed_viz
            },
            "metadata": {
                "precision": "FP16 (GPU)" if self.device.type == 'cuda' else "FP32 (CPU)",
                "device": str(self.device)
            }
        }
    
    def _create_main_visualization(self, image, attr_np, top10_prob, top10_idx, pred_class, confidence):
        """Create main visualization with predictions and heatmap"""
        fig = plt.figure(figsize=(24, 14))
        fig.patch.set_facecolor('#0a0a0a')
        
        gs = fig.add_gridspec(2, 3, height_ratios=[2, 1], hspace=0.3, wspace=0.15)
        
        ax1 = fig.add_subplot(gs[0, 0])
        ax2 = fig.add_subplot(gs[0, 1])
        ax3 = fig.add_subplot(gs[0, 2])
        ax4 = fig.add_subplot(gs[1, :])
        
        # Original image
        ax1.imshow(image)
        ax1.set_title("Original Image", fontsize=18, fontweight='700', color='#e0e0e0', pad=20)
        ax1.axis('off')
        
        # Heatmap
        im = ax2.imshow(attr_np, cmap='jet', interpolation='bilinear')
        ax2.set_title("Grad-CAM Heatmap", fontsize=18, fontweight='700', color='#e0e0e0', pad=20)
        ax2.axis('off')
        cbar = plt.colorbar(im, ax=ax2, fraction=0.046, pad=0.04)
        cbar.ax.tick_params(labelsize=12, colors='#a0a0a0')
        cbar.set_label('Importance', rotation=270, labelpad=25, color='#e0e0e0', fontsize=13, fontweight='600')
        
        # Overlay
        ax3.imshow(image)
        ax3.imshow(attr_np, cmap='jet', alpha=0.5, interpolation='bilinear')
        ax3.set_title(f"AI Focus: {self.labels[pred_class]}", fontsize=18, fontweight='700', color='#e0e0e0', pad=20)
        ax3.axis('off')
        
        # Top 10 predictions bar chart
        top10_labels = [self.labels[idx.item()] for idx in top10_idx[0]]
        top10_probs = [prob.item() * 100 for prob in top10_prob[0]]
        
        colors = ['#10b981' if i == 9 else '#3b82f6' if i >= 7 else '#8b5cf6' for i in range(10)]
        bars = ax4.barh(range(10), top10_probs[::-1], color=colors[::-1], edgecolor='#1a1a1a', linewidth=2)
        
        ax4.set_yticks(range(10))
        ax4.set_yticklabels(top10_labels[::-1], fontsize=14, color='#e0e0e0', fontweight='600')
        ax4.set_xlabel('Confidence (%)', fontsize=15, color='#e0e0e0', fontweight='700')
        ax4.set_title('Top 10 Predictions', fontsize=19, fontweight='800', color='#e0e0e0', pad=20)
        ax4.set_xlim([0, 100])
        ax4.grid(axis='x', alpha=0.2, color='#404040', linestyle='--')
        ax4.set_facecolor('#0a0a0a')
        ax4.spines['top'].set_visible(False)
        ax4.spines['right'].set_visible(False)
        ax4.spines['left'].set_color('#404040')
        ax4.spines['bottom'].set_color('#404040')
        ax4.tick_params(colors='#a0a0a0', labelsize=13)
        
        for bar, prob in zip(bars, top10_probs[::-1]):
            ax4.text(prob + 1.5, bar.get_y() + bar.get_height()/2,
                    f'{prob:.1f}%', va='center', fontsize=13, color='#e0e0e0', fontweight='700')
        
        plt.tight_layout()
        
        # Convert to PIL Image
        buf = BytesIO()
        plt.savefig(buf, format='png', dpi=150, bbox_inches='tight', facecolor='#0a0a0a')
        buf.seek(0)
        result_image = Image.open(buf)
        plt.close(fig)
        
        return result_image
    
    def _create_detailed_heatmap(self, image, attr_np):
        """Create detailed heatmap comparison"""
        fig, axes = plt.subplots(2, 2, figsize=(20, 18))
        fig.patch.set_facecolor('#0a0a0a')
        
        # Original
        axes[0, 0].imshow(image)
        axes[0, 0].set_title("Original Image", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        axes[0, 0].axis('off')
        
        # Jet colormap
        axes[0, 1].imshow(image)
        axes[0, 1].imshow(attr_np, cmap='jet', alpha=0.6, interpolation='bilinear')
        axes[0, 1].set_title("Jet Colormap Overlay", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        axes[0, 1].axis('off')
        
        # Hot colormap
        axes[1, 0].imshow(image)
        axes[1, 0].imshow(attr_np, cmap='hot', alpha=0.6, interpolation='bilinear')
        axes[1, 0].set_title("Hot Colormap Overlay", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        axes[1, 0].axis('off')
        
        # Viridis with contours
        axes[1, 1].imshow(image)
        axes[1, 1].imshow(attr_np, cmap='viridis', alpha=0.6, interpolation='gaussian')
        axes[1, 1].contour(attr_np, levels=6, colors='white', linewidths=2, alpha=0.9)
        axes[1, 1].set_title("Viridis + Contours", fontsize=17, fontweight='700', color='#e0e0e0', pad=15)
        axes[1, 1].axis('off')
        
        plt.tight_layout()
        
        # Convert to PIL Image
        buf = BytesIO()
        plt.savefig(buf, format='png', dpi=140, bbox_inches='tight', facecolor='#0a0a0a')
        buf.seek(0)
        detailed_image = Image.open(buf)
        plt.close(fig)
        
        return detailed_image
>>>>>>> 95fbb696c2bff2b497d717df118dc68761b9836f
