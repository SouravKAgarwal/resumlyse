import docx
from parsers.base import BaseParser
from schemas.resume import ParsedResume

class DocxParser(BaseParser):
    def parse(self, file_path: str) -> ParsedResume:
        doc = docx.Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        return ParsedResume(text=text, hyperlinks=[])
