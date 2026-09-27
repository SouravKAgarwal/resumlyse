from pydantic import BaseModel, Field


class KeywordMatch(BaseModel):
    keyword: str = Field(
        ...,
        description="Target industry or role skill keyword evaluated against the resume",
        examples=["Python", "FastAPI", "Docker", "Machine Learning"],
    )
    found: bool = Field(
        ...,
        description="Indicates whether the keyword was detected within the resume",
        examples=[True],
    )
    context: str | None = Field(
        default=None,
        description="Contextual excerpt from the resume where the keyword or related match was found",
        examples=["Built microservices using Python and FastAPI with 99.9% uptime"],
    )


class SectionPresence(BaseModel):
    section_name: str = Field(
        ...,
        description="Standard section heading (e.g. Work Experience, Education, Skills, Projects)",
        examples=["Work Experience", "Education", "Skills", "Projects"],
    )
    present: bool = Field(
        ...,
        description="Whether this section was successfully parsed and identified",
        examples=[True],
    )
    quality_score: int = Field(
        default=0,
        ge=0,
        le=100,
        description="Section rating from 0 to 100 assessing structure, metrics, and depth",
        examples=[85],
    )
    feedback: str = Field(
        ...,
        description="Actionable diagnostic feedback and recommendations for this section",
        examples=["Strong quantifiable accomplishments included with clear bullet points."],
    )
    suggested_content: str | None = Field(
        default=None,
        description="Tailored recommendation or example wording to improve or complete this section",
        examples=["Consider adding specific metrics, such as team size or percentage improvements."],
    )


class CategoryScore(BaseModel):
    category: str = Field(
        ...,
        description="Evaluation dimension: Impact, Brevity, ATS Compatibility, Style, or Skills",
        examples=["ATS Compatibility", "Impact & Metrics", "Content Quality"],
    )
    score: int = Field(
        ...,
        ge=0,
        le=100,
        description="Calculated category score from 0 to 100",
        examples=[88],
    )
    weight: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Relative weight of this category in calculating the overall composite score",
        examples=[0.25],
    )
    feedback: str = Field(
        ...,
        description="Summary feedback identifying strengths and weaknesses in this dimension",
        examples=["Excellent ATS parseability with standard section headings and modern font hierarchy."],
    )
    suggestions: list[str] = Field(
        default_factory=list,
        description="Actionable bulleted suggestions for boosting performance in this category",
        examples=[
            [
                "Replace passive voice with strong action verbs",
                "Ensure date ranges follow consistent formatting (e.g. MMM YYYY)",
            ]
        ],
    )


class AnalysisResult(BaseModel):
    overall_score: int = Field(
        ...,
        ge=0,
        le=100,
        description="Comprehensive weighted composite score from 0 to 100",
        examples=[82],
    )
    category_scores: list[CategoryScore] = Field(
        ...,
        description="Detailed score breakdown across all evaluated dimensions",
    )
    sections: list[SectionPresence] = Field(
        ...,
        description="Structural audit of standard resume sections and their quality scores",
    )
    keyword_matches: list[KeywordMatch] = Field(
        default_factory=list,
        description="Extracted industry skill keywords and job description match verification",
    )
    strengths: list[str] = Field(
        ...,
        description="Key competitive advantages and standout elements detected in the resume",
        examples=[
            [
                "Quantified impact present across majority of career bullet points",
                "Clean ATS-compliant layout and hierarchy",
            ]
        ],
    )
    critical_improvements: list[str] = Field(
        ...,
        description="Highest priority improvements recommended to improve interview call-back rates",
        examples=[
            [
                "Add a targeted summary section highlighting core technical competencies",
                "Ensure all acronyms are spelled out on first reference",
            ]
        ],
    )
    summary: str = Field(
        ...,
        description="Executive diagnostic summary of the resume evaluation",
        examples=[
            "Strong software engineering profile with solid technical depth. Minor adjustments to formatting and metric clarity will maximize ATS ranking."
        ],
    )
