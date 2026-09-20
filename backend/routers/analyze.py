from fastapi import APIRouter, File, Form, UploadFile
from schemas.requests import AnalyzeResponse
from services.analysis_service import AnalysisService
from utils.security import validate_file_security

router = APIRouter(prefix="/api/analyze", tags=["Analyze"])

@router.post("", response_model=AnalyzeResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(None),
):
    # Validate magic bytes first
    await validate_file_security(file)
        
    service = AnalysisService()
    return service.process_upload(file, job_description)
