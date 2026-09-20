from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db
from database.models import ResumeAnalysis
from schemas.analysis import AnalysisResult
from schemas.requests import AnalyzeResponse

router = APIRouter(prefix="/api/history", tags=["History"])


@router.get("")
def get_history(db: Session = Depends(get_db)):
    """List all past analyses (summary only, newest first)."""
    records = db.query(ResumeAnalysis).order_by(ResumeAnalysis.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "filename": r.filename,
            "overall_score": r.overall_score,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "job_description": r.job_description,
        }
        for r in records
    ]


@router.get("/{id}", response_model=AnalyzeResponse)
def get_analysis(id: int, db: Session = Depends(get_db)):
    """Get full analysis details for a specific record."""
    record = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    analysis = AnalysisResult.model_validate(record.analysis_data)
    return AnalyzeResponse(
        id=record.id,
        filename=record.filename,
        analysis=analysis,
    )


@router.delete("/{id}")
def delete_history(id: int, db: Session = Depends(get_db)):
    """Delete an analysis record."""
    record = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    db.delete(record)
    db.commit()
    return {"message": "Deleted successfully"}
