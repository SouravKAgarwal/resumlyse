from striprtf.striprtf import rtf_to_text
from parsers.base import BaseParser
from schemas.resume import ParsedResume

class RtfParser(BaseParser):
    def parse(self, file_path: str) -> ParsedResume:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        text = rtf_to_text(content)
        return ParsedResume(text=text, hyperlinks=[])
