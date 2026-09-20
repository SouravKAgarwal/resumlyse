from pydantic import BaseModel
from typing import Optional


class KeywordMatch(BaseModel):
    keyword: str
    found: bool
    context: Optional[str] = None


class SectionPresence(BaseModel):
    section_name: str
    present: bool
    quality_score: int = 0
    feedback: str
    suggested_content: Optional[str] = None


class CategoryScore(BaseModel):
    category: str
    score: int
    weight: float
    feedback: str
    suggestions: list[str]


class AnalysisResult(BaseModel):
    overall_score: int
    category_scores: list[CategoryScore]
    sections: list[SectionPresence]
    keyword_matches: list[KeywordMatch] = []
    strengths: list[str]
    critical_improvements: list[str]
    summary: str
