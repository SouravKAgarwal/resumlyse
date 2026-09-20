from pydantic import BaseModel
from schemas.analysis import AnalysisResult


class AnalyzeResponse(BaseModel):
    id: int
    filename: str
    analysis: AnalysisResult
