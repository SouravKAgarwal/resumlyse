from typing import Annotated

from fastapi import APIRouter, File
from schemas.requests import AnalyzeResponse, AnalyzeResumeRequest
from services.analysis_service import AnalysisService
from utils.security import validate_file_security

router = APIRouter(prefix="/api/analyze", tags=["Analysis"])


@router.post(
    "",
    response_model=AnalyzeResponse,
    summary="Analyze Resume Document",
    operation_id="analyzeResume",
    responses={
        200: {
            "description": "Resume parsed and evaluated successfully. Returns multidimensional score breakdown, section audit, and keyword matches.",
            "model": AnalyzeResponse,
        },
        400: {
            "description": "Invalid file format, corrupted document, or file failed binary security inspection.",
        },
        422: {
            "description": "Validation error in multipart form-data payload (e.g. missing resume file).",
        },
    },
)
async def analyze_resume(
    payload: Annotated[AnalyzeResumeRequest, File()],
):
    """
    Parse an uploaded resume document and compute comprehensive ATS scoring, section diagnostics, and keyword alignment.
    """

    # Validate magic bytes first
    await validate_file_security(payload.file)

    service = AnalysisService()
    return service.process_upload(payload.file, payload.job_description)
