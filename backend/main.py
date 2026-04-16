from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image
import io
import base64
from typing import Dict, List, Optional
import logging
import os
import uuid
from sqlalchemy.orm import Session
from pydantic import BaseModel

from model import ImageAnalyzer
import models
from database import engine, get_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="XAI Classifier",
    description="Explainable image analysis with focus maps",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

analyzer = ImageAnalyzer()

class FeedbackRequest(BaseModel):
    analysis_id: int
    is_correct: bool
    corrected_label: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "XAI Classifier API", "status": "running"}

@app.get("/health")
@app.head("/health")
async def health_check():
    return {"status": "healthy", "model_ready": analyzer.model is not None}

@app.post("/classify")
async def classify_image(
    file: UploadFile = File(...),
    user_email: Optional[str] = Form(None),
    enable_attack: bool = Form(False),
    db: Session = Depends(get_db)
) -> JSONResponse:
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Please upload an image")
        
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        result = analyzer.analyze(image, test_stress=enable_attack)
        
        analysis_id = None
        if user_email:
            db_analysis = models.Analysis(
                user_email=user_email,
                image_path="",
                prediction=result["prediction"]["class"],
                confidence=result["prediction"]["confidence"]
            )
            db.add(db_analysis)
            db.commit()
            db.refresh(db_analysis)
            analysis_id = db_analysis.id

        def pil_to_base64(pil_image):
            if pil_image is None:
                return None
            buffered = io.BytesIO()
            pil_image.save(buffered, format="PNG")
            return base64.b64encode(buffered.getvalue()).decode()
        
        response = {
            "analysis_id": analysis_id,
            "prediction": {
                "class": result["prediction"]["class"],
                "confidence": result["prediction"]["confidence"],
                "top_predictions": result["prediction"]["top_predictions"]
            },
            "visualizations": {
                "main": pil_to_base64(result["visualizations"]["main"]),
                "detailed": pil_to_base64(result["visualizations"]["detailed"]),
                "perturbed_image": pil_to_base64(result["visualizations"].get("perturbed_image"))
            },
            "metadata": result["metadata"]
        }
        
        return JSONResponse(content=response)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/feedback")
async def submit_feedback(feedback: FeedbackRequest, db: Session = Depends(get_db)):
    try:
        db_feedback = models.Feedback(
            analysis_id=feedback.analysis_id,
            is_correct=feedback.is_correct,
            corrected_label=feedback.corrected_label
        )
        db.add(db_feedback)
        db.commit()
        return {"message": "Thanks for your feedback"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_history(user_email: str, db: Session = Depends(get_db)):
    history = db.query(models.Analysis).filter(models.Analysis.user_email == user_email).order_by(models.Analysis.timestamp.desc()).all()
    return history

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=7860, reload=True)
