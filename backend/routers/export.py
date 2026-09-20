from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from database.session import get_db
from database.models import ResumeAnalysis
from schemas.analysis import AnalysisResult
from services.export_service import ExportService
from pydantic import BaseModel

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


@router.get("/{id}")
def export_pdf(id: int, db: Session = Depends(get_db)):
    """Legacy endpoint: Generate and download a PDF analysis report by ID."""
    record = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    analysis = AnalysisResult.model_validate(record.analysis_data)
    pdf_bytes = ExportService.generate_pdf(analysis, filename=record.filename)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="analysis_{record.filename}.pdf"'
        },
    )
