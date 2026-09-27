from typing import Optional

from fastapi import UploadFile
from pydantic import BaseModel, Field
from schemas.analysis import AnalysisResult


class AnalyzeResumeRequest(BaseModel):
    file: UploadFile = Field(
        ...,
        description="Resume file to analyze (.pdf, .docx, .txt, or .rtf)",
    )
    job_description: Optional[str] = Field(
        default=None,
        description="Optional job description text to match against the resume for ATS keyword alignment",
        examples=["Senior Software Engineer specializing in Python, FastAPI, and Cloud Architecture."],
    )


class AnalyzeResponse(BaseModel):
    id: int = Field(
        default=0,
        description="Unique evaluation identifier for client-side tracking",
        examples=[1],
    )
    filename: str = Field(
        ...,
        description="Original filename of the analyzed resume",
        examples=["resume_john_doe.pdf"],
    )
    analysis: AnalysisResult = Field(
        ...,
        description="Comprehensive evaluation result including category scores, section feedback, and keywords",
    )
