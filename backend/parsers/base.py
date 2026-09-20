from abc import ABC, abstractmethod
from schemas.resume import ParsedResume

class BaseParser(ABC):
    @abstractmethod
    def parse(self, file_path: str) -> ParsedResume:
        pass
