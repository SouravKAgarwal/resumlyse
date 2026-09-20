from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass

class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    job_description = Column(Text, nullable=True)
    overall_score = Column(Float)
    analysis_data = Column(JSON) # Storing the full JSON result
    created_at = Column(DateTime, default=datetime.utcnow)
