export enum JobStatus {
  DRAFT = "draft",
  APPLIED = "applied",
  INTERVIEW = "interview",
  OFFER = "offer",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Job {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  appliedDate?: string;
  resumeVersions: number;
}

export interface ResumeVersion {
  id: number;
  version: number;
  filename: string;
  upload_date: string;
}
