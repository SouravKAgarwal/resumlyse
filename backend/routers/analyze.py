from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db
from services.analysis_service import AnalysisService
from schemas.requests import AnalyzeResponse
from utils.security import validate_file_security

router = APIRouter(prefix="/api/analyze", tags=["Analyze"])

@router.post("", response_model=AnalyzeResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(None),
    db: Session = Depends(get_db)
):
    # Validate magic bytes first
    await validate_file_security(file)
        
    service = AnalysisService(db)
    return service.process_upload(file, job_description)
