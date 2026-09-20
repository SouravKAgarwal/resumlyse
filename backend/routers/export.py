from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import BaseModel
from schemas.analysis import AnalysisResult
from services.export_service import ExportService

router = APIRouter(prefix="/api/export", tags=["Export"])


class ExportPdfRequest(BaseModel):
    filename: str
    analysis: AnalysisResult


@router.post("")
def export_pdf_direct(payload: ExportPdfRequest):
    """Generate and download a PDF report directly from client-side analysis data (privacy-first)."""
    pdf_bytes = ExportService.generate_pdf(payload.analysis, filename=payload.filename)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="analysis_{payload.filename}.pdf"'
        },
    )