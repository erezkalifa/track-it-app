from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.models.job import JobStatus

class ResumeVersionBase(BaseModel):
    filename: str
    version: int
    notes: Optional[str] = None

class ResumeVersionCreate(ResumeVersionBase):
    pass

class ResumeVersionResponse(ResumeVersionBase):
    id: int
    file_path: str
    job_id: int
    upload_date: datetime

    model_config = ConfigDict(from_attributes=True)

class JobBase(BaseModel):
    company: str = Field(..., min_length=1, max_length=100)
    position: str = Field(..., min_length=1, max_length=100)
    notes: Optional[str] = None
    status: JobStatus = JobStatus.PENDING
    applied_date: Optional[datetime] = None

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int
    resume_path: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    resumes: List[ResumeVersionResponse] = []

    model_config = ConfigDict(from_attributes=True) 