import torch
import os
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import gradio as gr
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

def load_custom_model():
    model_path = "model/xai_resnet18.pth"
    print(f"🚀 Loading custom ResNet18 model from {model_path}...")
    try:
        checkpoint = torch.load(model_path, map_location=DEVICE)
        labels = checkpoint.get('class_names', ['Class ' + str(i) for i in range(10)])
        
        model = models.resnet18(weights=None)
        model.fc = nn.Linear(model.fc.in_features, len(labels))
        
        state_dict = checkpoint.get('model_state_dict', checkpoint)
        model.load_state_dict(state_dict)
        model.eval().to(DEVICE)
        
        if DEVICE.type == 'cuda':
            model = model.half()
            print("✅ Model optimized with FP16 precision")
        
        print(f"✅ Model loaded successfully with {len(labels)} classes!")
        return model, labels, "ResNet18 (Custom)"
    except Exception as e:
        print(f"❌ Error loading custom model: {e}")
        print("⚠️ Falling back to ResNet152 ImageNet model...")
        model = models.resnet152(weights='IMAGENET1K_V2')
        model.eval().to(DEVICE)
        url = "https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt"
        labels = [line.decode('utf-8').strip() for line in urllib.request.urlopen(url).readlines()]
        return model, labels, "ResNet152 (Generic)"

model, CLASS_LABELS, MODEL_TYPE = load_custom_model()
target_layer = model.layer4[-1]
gradcam = LayerGradCam(model, target_layer)

transform = transforms.Compose([
    transforms.Resize((224, 224), interpolation=transforms.InterpolationMode.BILINEAR),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

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

def predict_and_explain(image, enable_attack, attack_strength):
    if image is None:
        return "Please upload an image", None, None, None

    try:
        img_tensor = transform(image).unsqueeze(0).to(DEVICE)
        
        original_tensor = img_tensor.clone()
        original_tensor.requires_grad = True

        if DEVICE.type == 'cuda':
            model.float()
            original_tensor = original_tensor.float()

        output = model(original_tensor)
        probabilities = torch.softmax(output, dim=1)
        top_prob, top_idx = torch.topk(probabilities, min(10, len(CLASS_LABELS)))
        original_pred_class = top_idx[0][0].item()

        if enable_attack:
            loss = nn.CrossEntropyLoss()(output, torch.tensor([original_pred_class]).to(DEVICE))
            model.zero_grad()
            loss.backward()
            data_grad = original_tensor.grad.data
            
            perturbed_tensor = fgsm_attack(original_tensor, attack_strength, data_grad)
            
            output = model(perturbed_tensor)
            probabilities = torch.softmax(output, dim=1)
            top_prob, top_idx = torch.topk(probabilities, min(10, len(CLASS_LABELS)))
            
            img_tensor = perturbed_tensor.detach()
            
            denorm_img = denormalize(img_tensor.squeeze(0)).cpu().numpy().transpose(1, 2, 0)
            vis_image = (denorm_img * 255).astype(np.uint8)
        else:
            vis_image = np.array(image.resize((224, 224)))
            img_tensor = img_tensor.detach()

        pred_class = top_idx[0][0].item()
        confidence = top_prob[0][0].item()

        if DEVICE.type == 'cuda':
            grad_tensor = img_tensor.float()
        else:
            grad_tensor = img_tensor
            
        attributions = gradcam.attribute(grad_tensor, target=pred_class)
        attr_resized = interpolate(attributions, size=(224, 224), mode='bilinear', align_corners=False)
        attr_np = attr_resized.squeeze().cpu().detach().numpy()
        attr_np = (attr_np - attr_np.min()) / (attr_np.max() - attr_np.min() + 1e-8)

        if DEVICE.type == 'cuda':
            model.half()

        fig = plt.figure(figsize=(24, 14))
        fig.patch.set_facecolor('#0d0f1a')
        
        gs = fig.add_gridspec(2, 3, height_ratios=[2, 1], hspace=0.3, wspace=0.15)
        
        ax1 = fig.add_subplot(gs[0, 0])
        ax2 = fig.add_subplot(gs[0, 1])
        ax3 = fig.add_subplot(gs[0, 2])
        ax4 = fig.add_subplot(gs[1, :])
        
        ax1.imshow(vis_image)
        title_str = "Adversarial Image" if enable_attack else "Original Image"
        ax1.set_title(title_str, fontsize=18, fontweight='700', color='#f8fafc', pad=20)
        ax1.axis('off')
        
        im = ax2.imshow(attr_np, cmap='jet', interpolation='bilinear')
        ax2.set_title("Grad-CAM Heatmap", fontsize=18, fontweight='700', color='#f8fafc', pad=20)
        ax2.axis('off')
        cbar = plt.colorbar(im, ax=ax2, fraction=0.046, pad=0.04)
        cbar.ax.tick_params(labelsize=12, colors='#94a3b8')
        cbar.set_label('Importance', rotation=270, labelpad=25, color='#f8fafc', fontsize=13, fontweight='600')
    
        ax3.imshow(vis_image)
        ax3.imshow(attr_np, cmap='jet', alpha=0.5, interpolation='bilinear')
        ax3.set_title(f"AI Focus: {CLASS_LABELS[pred_class]}", fontsize=18, fontweight='700', color='#f8fafc', pad=20)
        ax3.axis('off')
        
        num_to_show = top_idx.shape[1]
        top_labels = [CLASS_LABELS[idx.item()] for idx in top_idx[0]]
        top_probs = [prob.item() * 100 for prob in top_prob[0]]
        
        colors = ['#10b981' if i == num_to_show-1 else '#3b82f6' if i >= num_to_show-3 else '#8b5cf6' for i in range(num_to_show)]
        if enable_attack and CLASS_LABELS[pred_class] != CLASS_LABELS[original_pred_class]:
            colors = ['#ef4444' if i == num_to_show-1 else '#f59e0b' if i >= num_to_show-3 else '#8b5cf6' for i in range(num_to_show)]
            
        bars = ax4.barh(range(num_to_show), top_probs[::-1], color=colors[::-1], edgecolor='#020617', linewidth=2)
        
        ax4.set_yticks(range(num_to_show))
        ax4.set_yticklabels(top_labels[::-1], fontsize=14, color='#f8fafc', fontweight='600')
        ax4.set_xlabel('Confidence (%)', fontsize=15, color='#f8fafc', fontweight='700')
        ax4.set_title(f'Top {num_to_show} Predictions', fontsize=19, fontweight='800', color='#f8fafc', pad=20)
        ax4.set_xlim([0, 100])
        ax4.grid(axis='x', alpha=0.1, color='#e2e8f0', linestyle='--')
        ax4.set_facecolor('#0d0f1a')
        ax4.spines['top'].set_visible(False)
        ax4.spines['right'].set_visible(False)
        ax4.spines['left'].set_color('#1e293b')
        ax4.spines['bottom'].set_color('#1e293b')
        ax4.tick_params(colors='#94a3b8', labelsize=13)
        
        for bar, prob in zip(bars, top_probs[::-1]):
            ax4.text(prob + 1.5, bar.get_y() + bar.get_height()/2, 
                    f'{prob:.1f}%', va='center', fontsize=13, color='#f8fafc', fontweight='700')
        
        plt.tight_layout()
        
        buf = BytesIO()
        plt.savefig(buf, format='png', dpi=150, bbox_inches='tight', facecolor='#0d0f1a')
        buf.seek(0)
        result_image = Image.open(buf)
        plt.close(fig)

        fig2, axes = plt.subplots(2, 2, figsize=(20, 18)) 
        fig2.patch.set_facecolor('#0d0f1a')
        
        axes[0, 0].imshow(vis_image)
        axes[0, 0].set_title(title_str, fontsize=17, fontweight='700', color='#f8fafc', pad=15)
        axes[0, 0].axis('off')
        
        axes[0, 1].imshow(vis_image)
        axes[0, 1].imshow(attr_np, cmap='jet', alpha=0.6, interpolation='bilinear')
        axes[0, 1].set_title("Jet Colormap Overlay", fontsize=17, fontweight='700', color='#f8fafc', pad=15)
        axes[0, 1].axis('off')
        
        axes[1, 0].imshow(vis_image)
        axes[1, 0].imshow(attr_np, cmap='hot', alpha=0.6, interpolation='bilinear')
        axes[1, 0].set_title("Hot Colormap Overlay", fontsize=17, fontweight='700', color='#f8fafc', pad=15)
        axes[1, 0].axis('off')
        
        axes[1, 1].imshow(vis_image)
        axes[1, 1].imshow(attr_np, cmap='viridis', alpha=0.6, interpolation='gaussian')
        axes[1, 1].contour(attr_np, levels=6, colors='white', linewidths=2, alpha=0.9)
        axes[1, 1].set_title("Viridis + Contours", fontsize=17, fontweight='700', color='#f8fafc', pad=15)
        axes[1, 1].axis('off')
        
        plt.tight_layout()
        
        buf2 = BytesIO()
        plt.savefig(buf2, format='png', dpi=140, bbox_inches='tight', facecolor='#0d0f1a')
        buf2.seek(0)
        detailed_heatmap = Image.open(buf2)
        plt.close(fig2)

        badge = "high" if confidence > 0.8 else "medium" if confidence > 0.5 else "low"
        if enable_attack:
            badge = "alert"
            
        badge_text = "Hacked / Unreliable" if enable_attack else ("High Confidence" if confidence > 0.8 else "Medium Confidence" if confidence > 0.5 else "Low Confidence")
        badge_icon = "🏴‍☠️" if enable_attack else ("🎯" if confidence > 0.8 else "⚡" if confidence > 0.5 else "⚠️")

        top5_html = "<div class='top5-grid'>"
        icons = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"]
        for i, (prob, idx) in enumerate(zip(top_prob[0][:5], top_idx[0][:5])):
            pct = prob.item() * 100
            bar_color = "linear-gradient(90deg, #ef4444, #f97316)" if enable_attack else "linear-gradient(90deg, #3b82f6, #6366f1)"
            top5_html += f"""
            <div class='top5-row'>
                <span class='rank'>{icons[i]}</span>
                <span class='label'>{CLASS_LABELS[idx.item()]}</span>
                <div class='bar-wrap'><div class='bar' style='width:{pct}%; background:{bar_color}'></div></div>
                <span class='pct'>{pct:.2f}%</span>
            </div>"""
        top5_html += "</div>"
        
        status_banner = ""
        if enable_attack:
            status_banner = f"""
            <div class="attack-banner">
                <span class="attack-icon">⚠️</span>
                <div>
                    <h4 style="margin:0;color:#fca5a5;font-weight:700;">Adversarial Attack Active</h4>
                    <p style="margin:0;font-size:0.85rem;color:#fecaca;">Model certainty manipulated intentionally.</p>
                </div>
            </div>
            """

        prediction_text = f"""
<div class="result-card">
    {status_banner}
    <div class="pred-header">
        <h2 class="pred-label">{CLASS_LABELS[pred_class]}</h2>
        <div class="badge badge-{badge}">{badge_icon} {badge_text}</div>
    </div>
    <div class="conf-score">{confidence*100:.2f}%</div>
    <div class="model-tag">🔒 Defense Auditing Active</div>
    <div class="divider"></div>
    {top5_html}
</div>"""
        
        perturbed_display = vis_image if enable_attack else None
        
        return prediction_text, result_image, detailed_heatmap, perturbed_display

    except Exception as e:
        import traceback
        traceback.print_exc()
        return f"<div class='error-msg'>⚠️ Error: {str(e)}</div>", None, None, None


custom_css = """
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body, .gradio-container { margin: 0 !important; padding: 0 !important; width: 100vw !important; min-height: 100vh !important; max-width: 100vw !important; background: #020617 !important; background-image: radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08), transparent 25%), radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08), transparent 25%) !important; font-family: 'Outfit', sans-serif !important; color: #f8fafc !important; }
.gradio-container { padding: 0 !important; }
.main-wrapper { padding: 2rem; max-width: 1600px; margin: 0 auto; position: relative; z-index: 2; }
.header-container { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; margin-bottom: 2rem; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); }
.header-title { font-size: 1.8rem; font-weight: 800; background: linear-gradient(to right, #60a5fa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; }
.grid-layout { display: grid; grid-template-columns: 380px 1fr; gap: 1.5rem; }
.panel { background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 1.5rem; backdrop-filter: blur(16px); box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); transition: transform 0.3s ease, box-shadow 0.3s ease; }
.panel:hover { border-color: rgba(255, 255, 255, 0.12); box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3); }
.panel-title { font-size: 1.1rem; font-weight: 700; color: #cbd5e1; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; }
.panel-title i { color: #8b5cf6; }
#input-image { border: 2px dashed rgba(99, 102, 241, 0.3) !important; border-radius: 16px !important; background: rgba(2, 6, 23, 0.4) !important; height: 300px !important; transition: all 0.3s ease; }
#input-image:hover { border-color: #6366f1 !important; background: rgba(30, 27, 75, 0.3) !important; }
.control-row { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
.attack-box { background: rgba(127, 29, 29, 0.2); border: 1px solid rgba(239, 68, 68, 0.3); padding: 1rem; border-radius: 12px; margin-top: 1rem; }
.attack-box-title { font-size: 0.9rem; font-weight: 600; color: #fca5a5; margin-bottom: 0.5rem; }
.gr-button { border-radius: 12px !important; font-weight: 700 !important; height: 48px !important; font-size: 1rem !important; transition: all 0.3s ease !important; border: none !important; letter-spacing: 0.5px; }
.gr-button-primary { background: linear-gradient(135deg, #4f46e5, #7c3aed) !important; color: white !important; box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3) !important; }
.gr-button-primary:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4) !important; filter: brightness(1.1); }
.result-card { display: flex; flex-direction: column; gap: 0.75rem; }
.pred-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
.pred-label { font-size: 2.2rem; font-weight: 800; color: #f8fafc; margin: 0; letter-spacing: -0.5px; text-transform: capitalize; }
.badge { padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.badge-high { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
.badge-medium { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
.badge-low { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
.badge-alert { background: rgba(220, 38, 38, 0.3); color: #fca5a5; border: 1px solid rgba(220, 38, 38, 0.5); animation: pulse 2s infinite; }
.conf-score { font-size: 3rem; font-weight: 900; background: linear-gradient(to right, #60a5fa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; line-height: 1; }
.model-tag { display: inline-block; background: rgba(148, 163, 184, 0.1); color: #cbd5e1; padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; width: fit-content; }
.divider { height: 1px; background: rgba(255, 255, 255, 0.1); margin: 1rem 0; }
.top5-grid { display: flex; flex-direction: column; gap: 0.6rem; }
.top5-row { display: grid; grid-template-columns: 30px 1fr auto 70px; align-items: center; gap: 0.8rem; padding: 0.6rem; border-radius: 10px; background: rgba(2, 6, 23, 0.4); border: 1px solid transparent; transition: all 0.2s; }
.top5-row:hover { border-color: rgba(255, 255, 255, 0.1); background: rgba(30, 41, 59, 0.4); }
.rank { font-size: 1.2rem; text-align: center; }
.label { color: #e2e8f0; font-weight: 500; font-size: 0.95rem; text-transform: capitalize; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar-wrap { background: rgba(15, 23, 42, 0.6); height: 8px; border-radius: 4px; overflow: hidden; min-width: 80px; }
.bar { height: 100%; border-radius: 4px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }
.pct { color: #e2e8f0; font-weight: 700; font-size: 0.85rem; text-align: right; }
.viz-row { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-top: 1.5rem; }
#result-image, #detailed-heatmap, #perturbed-display { border-radius: 16px !important; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05); background: rgba(2, 6, 23, 0.5) !important; }
.attack-banner { display: flex; gap: 1rem; align-items: center; background: rgba(127, 29, 29, 0.3); border: 1px solid rgba(239, 68, 68, 0.4); padding: 1rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 4px 20px rgba(220, 38, 38, 0.15); }
.attack-icon { font-size: 2rem; animation: shake 0.5s infinite alternate; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
@keyframes shake { 0% { transform: rotate(-5deg); } 100% { transform: rotate(5deg); } }
footer { display: none !important; }
@media (max-width: 1024px) {
    .grid-layout { grid-template-columns: 1fr; }
    .main-wrapper { padding: 1rem; }
}
"""

with gr.Blocks(css=custom_css, theme=gr.themes.Base()) as demo:
    with gr.Column(elem_classes="main-wrapper"):
        gr.HTML('''
            <div class="header-container">
                <h1 class="header-title">XAI Security & Reliability Interface</h1>
                <div style="text-align: right;">
                    <div style="color: #94a3b8; font-size: 0.85rem; font-weight: 600;">ARCHITECTURE</div>
                    <div style="color: #38bdf8; font-weight: 700; letter-spacing: 1px;">ResNet18 • GradCAM</div>
                </div>
            </div>
        ''')

        with gr.Row(elem_classes="grid-layout"):
            with gr.Column(elem_classes="panel"):
                gr.HTML("<div class='panel-title'>📁 Input Source</div>")
                input_image = gr.Image(type="pil", label=None, elem_id="input-image", show_label=False, container=False)
                
                with gr.Column(elem_classes="attack-box"):
                    gr.HTML("<div class='attack-box-title'>🛡️ Adversarial Testing Studio</div>")
                    enable_attack = gr.Checkbox(label="Inject FGSM Adversarial Noise", value=False)
                    attack_strength = gr.Slider(minimum=0.01, maximum=0.2, step=0.01, value=0.05, label="Attack Strength (Epsilon)", interactive=True)
                
                predict_btn = gr.Button("Execute Analysis Process", variant="primary", elem_classes="gr-button-primary")

            with gr.Column(elem_classes="panel"):
                gr.HTML("<div class='panel-title'>📊 Diagnostics & Classification</div>")
                output_text = gr.HTML('<div style="text-align: center; padding: 4rem 1rem; color: #64748b;">Upload media to commence security auditing and classification.</div>')

        gr.HTML("<br>")
        
        with gr.Row(elem_classes="grid-layout"):
            with gr.Column(elem_classes="panel", scale=1):
                gr.HTML("<div class='panel-title'>🖼️ Adversarial Noise Visualization</div>")
                perturbed_display = gr.Image(label=None, type="numpy", show_label=False, elem_id="perturbed-display", container=False)
            
            with gr.Column(elem_classes="panel", scale=2):
                gr.HTML("<div class='panel-title'>🔍 Explainable AI Heatmap (Grad-CAM)</div>")
                output_image = gr.Image(label=None, type="pil", show_label=False, elem_id="result-image", container=False)

        with gr.Column(elem_classes="panel"):
            gr.HTML("<div class='panel-title'>🔬 Multi-Spectrum Topographical Analysis</div>")
            detailed_heatmap = gr.Image(label=None, type="pil", show_label=False, elem_id="detailed-heatmap", container=False)

    predict_btn.click(
        fn=predict_and_explain,
        inputs=[input_image, enable_attack, attack_strength],
        outputs=[output_text, output_image, detailed_heatmap, perturbed_display]
    )

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)