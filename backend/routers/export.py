from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import BaseModel, Field
from schemas.analysis import AnalysisResult
from services.export_service import ExportService

router = APIRouter(prefix="/api/export", tags=["Export"])


class ExportPdfRequest(BaseModel):
    filename: str = Field(
        ...,
        description="Base name for the generated analysis PDF report",
        examples=["resume_analysis.pdf"],
    )
    analysis: AnalysisResult = Field(
        ...,
        description="AnalysisResult payload generated from resume evaluation to compile into the PDF report",
    )


@router.post(
    "",
    summary="Export Analysis Report to PDF",
    operation_id="exportAnalysisPdf",
    responses={
        200: {
            "description": "Downloadable binary PDF executive summary report.",
            "content": {
                "application/pdf": {
                    "schema": {
                        "type": "string",
                        "format": "binary",
                    }
                }
            },
        },
        422: {
            "description": "Invalid analysis payload schema provided in request body.",
        },
    },
)
def export_pdf_direct(payload: ExportPdfRequest):
    """
    Compile client-side evaluation data into a downloadable, publication-ready PDF report.

    ### Features
    - **Executive Summary Generation**: Renders overall score gauge, category breakdown, ATS keyword matches, and improvement tips.
    - **Direct Streaming**: Returns an `application/pdf` binary stream with automatic `Content-Disposition` attachment header for immediate browser download.
    - **Zero Persistence**: Operates strictly on client-provided JSON data with no database writes or server-side retention.
    """
    pdf_bytes = ExportService.generate_pdf(payload.analysis, filename=payload.filename)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="analysis_{payload.filename}.pdf"'
        },
    )