export enum JobStatus {
  APPLIED = "applied",
  INTERVIEWING = "interviewing",
  REJECTED = "rejected",
  ACCEPTED = "accepted",
  PENDING = "pending",
}

export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
  is_guest?: boolean;
  updated_at?: string;
}

export interface Job {
  id: number;
  company: string;
  position: string;
  status: JobStatus;
  resume_path?: string;
  notes?: string;
  applied_date?: string;
  created_at: string;
  updated_at?: string;
  resumes: ResumeVersion[];
}

export interface ResumeVersion {
  id: number;
  filename: string;
  file_path: string;
  version: number;
  upload_date: string;
  notes?: string;
}
