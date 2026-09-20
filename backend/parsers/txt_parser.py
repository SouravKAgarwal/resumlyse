from parsers.base import BaseParser
from schemas.resume import ParsedResume

class TxtParser(BaseParser):
    def parse(self, file_path: str) -> ParsedResume:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
        return ParsedResume(text=text, hyperlinks=[])
