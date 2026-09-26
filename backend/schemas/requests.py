from fastapi import UploadFile
from pydantic import BaseModel, Field
from schemas.analysis import AnalysisResult


class AnalyzeResumeRequest(BaseModel):
    file: UploadFile = Field(
        ...,
        description="Resume file to analyze (.pdf, .docx, .txt, or .rtf)",
    )
    job_description: str | None = Field(
        default=None,
        description="Optional job description text to match against the resume",
    )


class AnalyzeResponse(BaseModel):
    id: int
    filename: str
    analysis: AnalysisResult

