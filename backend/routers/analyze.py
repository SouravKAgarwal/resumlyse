from typing import Annotated

from fastapi import APIRouter, File
from schemas.requests import AnalyzeResponse, AnalyzeResumeRequest
from services.analysis_service import AnalysisService
from utils.security import validate_file_security

router = APIRouter(prefix="/api/analyze", tags=["Analyze"])

@router.post("", response_model=AnalyzeResponse)
async def analyze_resume(
    payload: Annotated[AnalyzeResumeRequest, File()],
):
    # Validate magic bytes first
    await validate_file_security(payload.file)
        
    service = AnalysisService()
    return service.process_upload(payload.file, payload.job_description)

