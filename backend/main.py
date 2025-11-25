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

from model import ImageClassifier
import models
from database import engine, get_db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="XAI Image Classifier API",
    description="ResNet152 with Grad-CAM explainability",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Mount uploads directory to serve images
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Initialize model
logger.info("Loading model...")
classifier = ImageClassifier()
logger.info("Model loaded successfully!")

# Pydantic models for request/response
class FeedbackRequest(BaseModel):
    analysis_id: int
    is_correct: bool
    corrected_label: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "XAI Image Classifier API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": classifier.model is not None}

@app.post("/classify")
async def classify_image(
    file: UploadFile = File(...),
    user_email: Optional[str] = Form(None),
    db: Session = Depends(get_db)
) -> JSONResponse:
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Save image if user is logged in
        image_path = None
        # User requested to NOT store images in history
        # if user_email:
        #     filename = f"{uuid.uuid4()}.jpg"
        #     image_path = os.path.join(UPLOAD_DIR, filename)
        #     image.save(image_path)
        #     # Store relative path for serving
        #     image_path = f"/uploads/{filename}"

        # Run inference
        logger.info(f"Processing image: {file.filename}")
        result = classifier.predict_and_explain(image)
        
        # Save analysis to DB if user is logged in
        analysis_id = None
        if user_email:
            db_analysis = models.Analysis(
                user_email=user_email,
                image_path="", # Empty string as we are not saving image
                prediction=result["prediction"]["class"],
                confidence=result["prediction"]["confidence"]
            )
            db.add(db_analysis)
            db.commit()
            db.refresh(db_analysis)
            analysis_id = db_analysis.id

        def pil_to_base64(pil_image):
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
                "detailed": pil_to_base64(result["visualizations"]["detailed"])
            },
            "metadata": {
                "model": "ResNet152",
                "precision": result["metadata"]["precision"],
                "device": result["metadata"]["device"]
            }
        }
        
        return JSONResponse(content=response)
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

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
        return {"message": "Feedback received"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_history(user_email: str, db: Session = Depends(get_db)):
    history = db.query(models.Analysis).filter(models.Analysis.user_email == user_email).order_by(models.Analysis.timestamp.desc()).all()
    return history

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=7860, reload=True)
