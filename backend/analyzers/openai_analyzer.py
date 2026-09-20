import json

from analyzers.prompts import SYSTEM_PROMPT, USER_PROMPT_STANDALONE, USER_PROMPT_WITH_JD
from config import settings
from openai import OpenAI
from schemas.analysis import AnalysisResult


class OpenAIAnalyzer:
    def __init__(self):
        client_kwargs = {"api_key": settings.OPENAI_API_KEY}
        if settings.OPENAI_API_BASE:
            client_kwargs["base_url"] = settings.OPENAI_API_BASE
        self.client = OpenAI(**client_kwargs)

    def analyze(self, resume_text: str, job_description: str = None) -> AnalysisResult:
        """Analyze resume text using OpenAI-compatible API and return structured results."""
        if job_description:
            user_prompt = USER_PROMPT_WITH_JD.format(
                resume_text=resume_text,
                job_description=job_description,
            )
        else:
            user_prompt = USER_PROMPT_STANDALONE.format(
                resume_text=resume_text,
            )

        response = self.client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            response_format={"type": "json_object"},
        )

        content = response.choices[0].message.content
        data = json.loads(content)
        return AnalysisResult.model_validate(data)
