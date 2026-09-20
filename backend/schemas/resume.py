from pydantic import BaseModel


class Hyperlink(BaseModel):
    text: str
    url: str


class ParsedResume(BaseModel):
    text: str
    hyperlinks: list[Hyperlink] = []
    metadata: dict = {}
