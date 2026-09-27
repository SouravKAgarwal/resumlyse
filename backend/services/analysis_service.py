import logging
import os
import shutil

from analyzers.openai_analyzer import OpenAIAnalyzer
from config import settings
from fastapi import HTTPException, UploadFile
from parsers.router import get_parser
from schemas.requests import AnalyzeResponse

logger = logging.getLogger(__name__)

class AnalysisService:
    def __init__(self):
        self.analyzer = OpenAIAnalyzer()

    def process_upload(self, file: UploadFile, job_description: str = None) -> AnalyzeResponse:
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
            
            if not parsed_resume.text or not parsed_resume.text.strip():
                raise HTTPException(
                    status_code=400,
                    detail="No readable text found in document. Please upload a standard text-based PDF, DOCX, or TXT file rather than an image-only scanned document.",
                )

            logger.info("Sending parsed data for evaluation...")
            analysis_result = self.analyzer.analyze(parsed_resume.text, job_description)
            logger.info(f"Evaluation complete. Overall score computed: {analysis_result.overall_score}")
            
            logger.info("Evaluation complete. Returning result to client for private browser storage.")
            return AnalyzeResponse(
                id=0,
                filename=file.filename,
                analysis=analysis_result
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error occurred during analysis of {file.filename}: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail=f"Analysis failed: {str(e)}",
            )
        finally:
            if os.path.exists(file_path):
                logger.debug(f"Cleaning up temporary file: {file_path}")
                os.remove(file_path)
