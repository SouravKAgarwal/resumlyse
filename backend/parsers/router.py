import os
from parsers.base import BaseParser
from parsers.pdf_parser import PDFParser
from parsers.docx_parser import DocxParser
from parsers.txt_parser import TxtParser
from parsers.rtf_parser import RtfParser

def get_parser(file_path: str) -> BaseParser:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return PDFParser()
    elif ext == ".docx":
        return DocxParser()
    elif ext == ".txt":
        return TxtParser()
    elif ext == ".rtf":
        return RtfParser()
    else:
        raise ValueError(f"Unsupported file extension: {ext}")
