import logging
import os
import shutil

from analyzers.openai_analyzer import OpenAIAnalyzer
from config import settings
from fastapi import File, Form, UploadFile
from parsers.router import get_parser
from schemas.requests import AnalyzeResponse
from utils.security import validate_file_security

logger = logging.getLogger(__name__)

class StatelessAnalysisService:
    def __init__(self):
        self.analyzer = OpenAIAnalyzer()

    def process_upload(self, file: UploadFile, job_description: str | None = None) -> AnalyzeResponse:
        logger.info(f"Received upload request for file: {file.filename}")
        file_path = os.path.join(settings.TEMP_UPLOAD_DIR, file.filename)

        logger.debug(f"Saving temporary file to: {file_path}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        try:
            logger.info(f"Parsing document: {file.filename}")
            parser = get_parser(file_path)
            parsed_resume = parser.parse(file_path)

            logger.info(f"Document parsed successfully. Extracted {len(parsed_resume.text)} characters.")

            logger.info("Sending parsed data for evaluation...")
            analysis_result = self.analyzer.analyze(parsed_resume.text, job_description)
            logger.info(f"Evaluation complete. Overall score computed: {analysis_result.overall_score}")

            logger.info("Evaluation complete. Returning result to client for private browser storage.")
            return AnalyzeResponse(
                id=0,
                filename=file.filename,
                analysis=analysis_result
            )
        except Exception as e:
            logger.error(f"Error occurred during analysis of {file.filename}: {str(e)}", exc_info=True)
            raise
        finally:
            if os.path.exists(file_path):
                logger.debug(f"Cleaning up temporary file: {file_path}")
                os.remove(file_path)

# Create a single instance to reuse across requests
analysis_service = StatelessAnalysisService()

async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(None),
):
    # Validate magic bytes first
    await validate_file_security(file)

    # Process the upload using our stateless service
    result = analysis_service.process_upload(file, job_description)

    # Return with dummy ID since we're not storing history
    # The frontend will store the result in IndexedDB and use its own ID
    return result