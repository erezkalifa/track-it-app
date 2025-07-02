import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaFileAlt,
  FaCloudUploadAlt,
  FaEye,
  FaDownload,
  FaTrash,
  FaFolder,
  FaEdit,
  FaSave,
  FaTimes,
  FaBuilding,
  FaSuitcase,
  FaCalendarAlt,
  FaClipboardList,
  FaCheckCircle,
} from "react-icons/fa";
import { JobStatus } from "../types/types";
import type { Job } from "../types/types";
import type { ResumeVersion } from "../types/types";
import { api } from "../api/config";
import { useJobs } from "../context/JobContext";
import { useAuth } from "../context/AuthContext";

const PageContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(350px, 2fr) minmax(600px, 3fr);
  gap: 2rem;
`;

const CardContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  height: fit-content;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  svg {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.9;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const DetailsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  background: rgba(255, 255, 255, 0.02);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.08);
  }

  svg {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textLight};
    opacity: 0.8;
  }

  label {
    font-size: 0.75rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textLight};
    opacity: 0.8;
    min-width: 70px;
  }

  .value {
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.4;
    flex: 1;
  }

  &.status {
    .value {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      background: ${({ theme }) => theme.colors.primary}15;
      color: ${({ theme }) => theme.colors.primary};
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.875rem;
      width: fit-content;
    }
  }

  &.notes {
    align-items: flex-start;

    svg {
      margin-top: 2px;
    }

    .value {
      white-space: pre-wrap;
      font-size: 0.875rem;
      opacity: 0.9;
      max-height: 80px;
      overflow-y: auto;
      padding-right: 0.5rem;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }
    }
  }
`;

const ManageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem;
  background: ${({ theme }) => theme.colors.primary}15;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}25;
    border-color: ${({ theme }) => theme.colors.primary}40;
  }

  svg {
    font-size: 1rem;
  }

  span {
    flex: 1;
    text-align: left;
    font-size: 0.9375rem;
  }

  small {
    font-size: 0.8125rem;
    opacity: 0.8;
  }
`;

const UploadArea = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2rem;

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.02);
  }

  svg {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0.5rem 0;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textLight};
    margin: 0;
  }
`;

const ChooseFileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem;
  background: white;
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 25px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }

  svg {
    font-size: 1.125rem;
    margin: 0;
  }
`;

const VersionsTable = styled.div`
  margin-top: 2rem;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 60px minmax(200px, 1fr) 120px 100px;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;

  span {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textLight};
    font-weight: 500;
    white-space: nowrap;
  }
`;

const VersionRow = styled.div`
  display: grid;
  grid-template-columns: 60px minmax(200px, 1fr) 120px 100px;
  gap: 0.5rem;
  padding: 1rem;
  align-items: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const VersionBadge = styled.span`
  background: rgba(99, 102, 241, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const FileName = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 0;

  svg {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 1.125rem;
    flex-shrink: 0;
    margin-top: 0.25rem;
  }

  span {
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.text};
    overflow-wrap: break-word;
    display: inline-block;
    width: 20ch;
    white-space: pre-wrap;
  }
`;

const UploadDate = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.25rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 0.4rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 1rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: ${({ theme }) => theme.colors.text};
  }

  &.delete:hover {
    color: ${({ theme }) => theme.colors.danger};
    background: rgba(220, 38, 38, 0.1);
  }
`;

const DeleteSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 1rem;
`;

const DeleteWarning = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 1rem;
  font-size: 0.9375rem;
`;

const DeleteJobButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 300px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  svg {
    font-size: 1.125rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.9375rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s ease;

  &:hover,
  &:focus {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.9375rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:hover,
  &:focus {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  svg {
    font-size: 1rem;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    opacity: 0.9;
  }

  svg {
    font-size: 1rem;
  }
`;

const CancelButton = styled(SaveButton)`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const BackButton = styled.button`
  /* Position */
  position: absolute;
  top: -36px;
  left: 0;

  /* Layout */
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;

  /* Styling */
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.8;

  /* Icon styling */
  span {
    font-size: 1.25rem;
    line-height: 1;
    position: relative;
    top: -1px;
  }

  &:hover {
    opacity: 1;
    color: ${({ theme }) => theme.colors.text};
    transform: translateX(-2px);
  }
`;

const CardWrapper = styled.div`
  position: relative;
`;

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { jobs } = useJobs();
  const { isGuest } = useAuth();

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;

      try {
        if (isGuest) {
          // For guest users, find the job in the local jobs array
          const foundJob = jobs.find((j) => j.id === parseInt(id));
          if (foundJob) {
            setJob(foundJob);
          } else {
            setError("Job not found");
          }
        } else {
          // For regular users, fetch from API
          const response = await api.get(`/api/jobs/${id}`);
          setJob(response.data);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        setError("Failed to load job details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, isGuest, jobs]);

  const handleFileUpload = () => {
    if (isGuest) {
      alert("File upload is not available in guest mode");
      return;
    }
    // Handle file upload logic
  };

  const handleView = async (versionId: number) => {
    if (isGuest) {
      alert("File viewing is not available in guest mode");
      return;
    }
    if (!id) return;
    window.open(
      `http://localhost:8000/api/jobs/${id}/resume/${versionId}`,
      "_blank"
    );
  };

  const handleDownload = async (versionId: number) => {
    if (isGuest) {
      alert("File download is not available in guest mode");
      return;
    }
    if (!id) return;
    window.open(
      `http://localhost:8000/api/jobs/${id}/resume/${versionId}/download`,
      "_blank"
    );
  };

  const handleDelete = async (versionId: number) => {
    if (isGuest) {
      alert("File deletion is not available in guest mode");
      return;
    }
    if (!id) return;
    try {
      await api.delete(`/api/jobs/${id}/resume/${versionId}`);
      // Refresh the job data instead of the whole page
      const response = await api.get(`/api/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete resume");
    }
  };

  const handleDeleteJob = async () => {
    if (isGuest) {
      alert("Job deletion is not available in guest mode");
      return;
    }
    if (
      !id ||
      !window.confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/api/jobs/${id}`);
      navigate("/"); // Navigate back to the job list
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job");
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div>Loading job details...</div>
      </PageContainer>
    );
  }

  if (error || !job) {
    return (
      <PageContainer>
        <div>{error || "Job not found"}</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <CardsContainer>
        <CardWrapper>
          <BackButton onClick={() => navigate("/jobs")}>
            <span>&larr;</span> Back to Jobs
          </BackButton>
          <CardContainer>
            <CardHeader>
              <FaBriefcase />
              <h2>Job Details</h2>
            </CardHeader>

            <DetailsGrid>
              <FormGroup>
                <FaBuilding />
                <label>Company</label>
                <div className="value">{job.company}</div>
              </FormGroup>

              <FormGroup>
                <FaSuitcase />
                <label>Position</label>
                <div className="value">{job.position}</div>
              </FormGroup>

              <FormGroup className="status">
                <FaCheckCircle />
                <label>Status</label>
                <div className="value">{job.status}</div>
              </FormGroup>

              <FormGroup>
                <FaCalendarAlt />
                <label>Applied</label>
                <div className="value">
                  {job.applied_date
                    ? new Date(job.applied_date).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not set"}
                </div>
              </FormGroup>

              <FormGroup className="notes">
                <FaClipboardList />
                <label>Notes</label>
                <div className="value">{job.notes || "No notes added yet"}</div>
              </FormGroup>
            </DetailsGrid>

            <ManageButton>
              <FaCheckCircle />
              <span>Manage Interview Process</span>
              <small>•</small>
              <small>Track Progress</small>
            </ManageButton>
          </CardContainer>
        </CardWrapper>

        <div>
          <CardContainer>
            <CardHeader>
              <FaFileAlt />
              <h2>Resume Versions</h2>
            </CardHeader>

            <UploadArea onClick={handleFileUpload}>
              <FaCloudUploadAlt />
              <h3>Upload New Resume</h3>
              <p>Drag and drop your file here or click to browse</p>
              <ChooseFileButton>
                <FaFolder />
                Choose File
              </ChooseFileButton>
            </UploadArea>

            <VersionsTable>
              <TableHeader>
                <span>Version</span>
                <span>Filename</span>
                <span>Upload Date</span>
                <span>Actions</span>
              </TableHeader>

              {job.resumes.map((version) => (
                <VersionRow key={version.id}>
                  <VersionBadge>v{version.version}</VersionBadge>
                  <FileName>
                    <FaFileAlt />
                    <span>{version.filename}</span>
                  </FileName>
                  <UploadDate>
                    {new Date(version.upload_date).toLocaleString()}
                  </UploadDate>
                  <ActionButtons>
                    <ActionButton
                      title="View"
                      onClick={() => handleView(version.id)}
                    >
                      <FaEye />
                    </ActionButton>
                    <ActionButton
                      title="Download"
                      onClick={() => handleDownload(version.id)}
                    >
                      <FaDownload />
                    </ActionButton>
                    <ActionButton
                      title="Delete"
                      className="delete"
                      onClick={() => handleDelete(version.id)}
                    >
                      <FaTrash />
                    </ActionButton>
                  </ActionButtons>
                </VersionRow>
              ))}
            </VersionsTable>
          </CardContainer>
        </div>
      </CardsContainer>

      <DeleteSection>
        <DeleteWarning>
          Deleting this job will permanently remove all associated data and
          resume versions.
        </DeleteWarning>
        <DeleteJobButton onClick={handleDeleteJob}>
          <FaTrash />
          Delete Job Application
        </DeleteJobButton>
      </DeleteSection>
    </PageContainer>
  );
};

export default JobDetailPage;
