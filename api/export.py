from fastapi import APIRouter, Request, Response, HTTPException
from services.export_service import ExportService
from schemas.analysis import AnalysisResult
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class ExportPdfRequest(BaseModel):
    filename: str
    analysis: AnalysisResult

@router.post("")
async def export_pdf_direct(request: Request):
    """Generate and download a PDF report directly from client-side analysis data (privacy-first)."""
    try:
        payload = await request.json()
        # Validate the payload structure
        if "filename" not in payload or "analysis" not in payload:
            raise HTTPException(status_code=400, detail="Invalid request payload")

        pdf_bytes = ExportService.generate_pdf(payload["analysis"], filename=payload["filename"])
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="analysis_{payload["filename"]}.pdf"'
            },
        )
    except Exception as e:
        logger.error(f"Error generating PDF: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate PDF")