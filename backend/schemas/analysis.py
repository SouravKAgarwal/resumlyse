from pydantic import BaseModel


class KeywordMatch(BaseModel):
    keyword: str
    found: bool
    context: str | None = None


class SectionPresence(BaseModel):
    section_name: str
    present: bool
    quality_score: int = 0
    feedback: str
    suggested_content: str | None = None


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
