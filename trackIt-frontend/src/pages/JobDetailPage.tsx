import React, { useState, useEffect, useRef } from "react";
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
  FaBookmark,
  FaRegBookmark,
  FaPencilAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { JobStatus } from "../types/types";
import type { Job } from "../types/types";
import type { ResumeVersion } from "../types/types";
import { api } from "../api/config.js";
import { useJobs } from "../context/JobContext";
import { useAuth } from "../context/AuthContext";

// Main container with centered layout
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 1rem;
  background: #fafbfc;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

// Single centered container
const MainContainer = styled.div`
  width: 100%;
  max-width: 700px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

// Header with back button and save
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
  }

  svg {
    font-size: 14px;
  }
`;

const SaveButton = styled.button<{ $isSaved: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${({ $isSaved }) => ($isSaved ? "#4F46E5" : "#F3F4F6")};
  border: 1px solid ${({ $isSaved }) => ($isSaved ? "#4F46E5" : "#E5E7EB")};
  border-radius: 8px;
  color: ${({ $isSaved }) => ($isSaved ? "#FFFFFF" : "#374151")};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $isSaved }) => ($isSaved ? "#4338CA" : "#E5E7EB")};
  }

  svg {
    font-size: 14px;
  }
`;

// Tab navigation
const TabContainer = styled.div`
  background: #f9fafb;
  border-radius: 12px 12px 0 0;
  padding: 0 2rem;
  display: flex;
  gap: 0;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid
    ${({ $active }) => ($active ? "#4F46E5" : "transparent")};
  color: ${({ $active }) => ($active ? "#1F2937" : "#6B7280")};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    color: ${({ $active }) => ($active ? "#1F2937" : "#4F46E5")};
  }

  svg {
    font-size: 18px;
    color: ${({ $active }) => ($active ? "#1F2937" : "#6B7280")};
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    font-size: 14px;

    svg {
      font-size: 16px;
    }
  }
`;

// Tab content container
const TabContent = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

// Job Details Form
const DetailsForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const FormLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;

  svg {
    font-size: 16px;
    color: #6b7280;
  }

  @media (max-width: 768px) {
    min-width: auto;
  }
`;

const FormValue = styled.div`
  flex: 1;
  font-size: 16px;
  color: #1f2937;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  .value-text {
    flex: 1;
  }

  .edit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: #4f46e5;
      border-color: #4f46e5;
    }

    svg {
      font-size: 14px;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Resume Versions Section
const ResumeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const UploadCard = styled.div`
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #4f46e5;
    background: #f9fafb;
  }

  svg {
    font-size: 2rem;
    color: #4f46e5;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 16px;
    color: #1f2937;
    font-weight: 500;
    margin: 0.5rem 0;
  }

  p {
    font-size: 14px;
    color: #6b7280;
    margin: 0.5rem 0 1rem 0;
  }
`;

const ChooseFileButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #ffffff;
  color: #4f46e5;
  border: 1px solid #4f46e5;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4f46e5;
    color: #ffffff;
  }

  svg {
    font-size: 14px;
  }
`;

const VersionsTable = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 120px 100px;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;

  span {
    font-size: 14px;
    color: #374151;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    grid-template-columns: 60px 1fr 80px 80px;
    gap: 0.5rem;
    padding: 0.75rem;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 120px 100px;
  gap: 1rem;
  padding: 1rem;
  align-items: center;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 60px 1fr 80px 80px;
    gap: 0.5rem;
    padding: 0.75rem;
  }
`;

const VersionBadge = styled.span`
  background: #4f46e5;
  color: #ffffff;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
`;

const FileName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  color: #374151;

  svg {
    font-size: 16px;
    color: #6b7280;
  }
`;

const UploadDate = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.25rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{
  $variant?: "primary" | "secondary" | "danger";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: ${({ $variant }) => {
    switch ($variant) {
      case "primary":
        return "#4F46E5";
      case "danger":
        return "#EF4444";
      default:
        return "#F3F4F6";
    }
  }};
  border: 1px solid
    ${({ $variant }) => {
      switch ($variant) {
        case "primary":
          return "#4F46E5";
        case "danger":
          return "#EF4444";
        default:
          return "#E5E7EB";
      }
    }};
  border-radius: 6px;
  color: ${({ $variant }) => {
    switch ($variant) {
      case "primary":
        return "#FFFFFF";
      case "danger":
        return "#FFFFFF";
      default:
        return "#6B7280";
    }
  }};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  svg {
    font-size: 12px;
  }
`;

// Delete section
const DeleteSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  text-align: center;
`;

const DeleteWarning = styled.p`
  color: #991b1b;
  margin-bottom: 1rem;
  font-size: 14px;
`;

const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
    border-color: #dc2626;
  }

  svg {
    font-size: 14px;
  }
`;

// Editable field components (keeping existing logic)
const EditableField = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid transparent;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:hover:not(.editing) {
    background: rgba(79, 70, 229, 0.03);

    .value {
      color: #4f46e5;
      opacity: 1;
    }
    .edit-icon {
      color: #4f46e5;
      opacity: 0.9;
    }
  }

  &.editing {
    border: 1px solid #4f46e5;
    background: rgba(79, 70, 229, 0.03);
  }
`;

const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;

  .value {
    transition: color 0.2s ease, opacity 0.2s ease;
    opacity: 0.85;
    font-size: 14px;
  }
`;

const EditIcon = styled.div`
  font-size: 14px;
  opacity: 0.6;
  transition: color 0.2s ease, opacity 0.2s ease;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  color: #374151;
  font-size: 14px;
  width: 100%;

  &:focus {
    outline: none;
  }
`;

const Select = styled.select`
  background: transparent;
  border: none;
  color: #374151;
  font-size: 14px;
  width: 100%;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  option {
    background: #ffffff;
    color: #374151;
  }
`;

const TextArea = styled.textarea`
  background: transparent;
  border: none;
  color: #374151;
  font-size: 14px;
  width: 100%;
  min-height: 80px;
  resize: vertical;

  &:focus {
    outline: none;
  }
`;

interface EditableValueProps {
  value: string;
  type?: string;
  field: keyof Job;
  onSave: (field: keyof Job, value: string) => void;
  options?: string[];
  multiline?: boolean;
}

const EditableValue: React.FC<EditableValueProps> = ({
  value,
  type = "text",
  field,
  onSave,
  options,
  multiline,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);
  const inputRef = React.useRef<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editedValue !== value) {
      onSave(field, editedValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleBlur();
    }
    if (e.key === "Escape") {
      setEditedValue(value);
      setIsEditing(false);
    }
  };

  return (
    <EditableField className={isEditing ? "editing" : ""} onClick={handleClick}>
      {isEditing ? (
        multiline ? (
          <TextArea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        ) : options ? (
          <Select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            onBlur={handleBlur}
          >
            {options.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type}
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            max={
              type === "date"
                ? new Date().toISOString().split("T")[0]
                : undefined
            }
          />
        )
      ) : (
        <ValueContainer>
          <div className="value">
            {field === "status"
              ? value.charAt(0).toUpperCase() + value.slice(1)
              : field === "applied_date" && value
              ? new Date(value).toLocaleDateString()
              : value || "Not specified"}
          </div>
          <EditIcon className="edit-icon">
            <FaPencilAlt />
          </EditIcon>
        </ValueContainer>
      )}
    </EditableField>
  );
};

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, setJobs } = useJobs();
  const [job, setJob] = useState<Job | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "resume">("details");
  const { isGuest } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (isGuest) {
          const foundJob = jobs.find((j) => j.id === Number(id));
          if (foundJob) {
            setJob(foundJob);
          } else {
            setError("Job not found");
          }
        } else {
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

  const handleFieldSave = async (field: keyof Job, value: string) => {
    if (!job) return;

    try {
      const updatedJob = { ...job, [field]: value };
      const { data } = await api.put(`/api/jobs/${id}`, updatedJob);
      setJob(data);

      // Update the job in the jobs context
      setJobs((prevJobs) => prevJobs.map((j) => (j.id === data.id ? data : j)));
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const handleFileUpload = () => {
    if (isGuest) {
      alert("File upload is not available in guest mode");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !id) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("resume", file);

    try {
      await api.post(`/api/jobs/${id}/resume`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh the job data to show the new resume
      const response = await api.get(`/api/jobs/${id}`);
      setJob(response.data);

      // Reset the file input
      e.target.value = "";
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume");
    }
  };

  const handleView = async (versionId: number) => {
    if (isGuest) {
      alert("File viewing is not available in guest mode");
      return;
    }
    if (!id) return;
    const baseURL =
      process.env.NODE_ENV === "production"
        ? "https://track-it-app-production-bcae.up.railway.app"
        : "http://localhost:8000";
    window.open(`${baseURL}/api/jobs/${id}/resume/${versionId}`, "_blank");
  };

  const handleDownload = async (versionId: number) => {
    if (isGuest) {
      alert("File download is not available in guest mode");
      return;
    }
    if (!id) return;
    const baseURL =
      process.env.NODE_ENV === "production"
        ? "https://track-it-app-production-bcae.up.railway.app"
        : "http://localhost:8000";
    window.open(
      `${baseURL}/api/jobs/${id}/resume/${versionId}/download`,
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
      // Update the jobs context by filtering out the deleted job
      setJobs(jobs.filter((j) => j.id !== parseInt(id)));
      navigate("/jobs"); // Navigate back to the job list
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!job) return null;

  return (
    <PageContainer>
      <HeaderContainer>
        <BackButton onClick={() => navigate("/jobs")}>
          <FaArrowLeft />
          Back to Jobs
        </BackButton>
        <SaveButton onClick={() => setIsSaved(!isSaved)} $isSaved={isSaved}>
          {isSaved ? <FaBookmark /> : <FaRegBookmark />}
          {isSaved ? "Saved" : "Save Job"}
        </SaveButton>
      </HeaderContainer>

      <MainContainer>
        <TabContainer>
          <TabButton
            $active={activeTab === "details"}
            onClick={() => setActiveTab("details")}
          >
            <FaBriefcase />
            Job Details
          </TabButton>
          <TabButton
            $active={activeTab === "resume"}
            onClick={() => setActiveTab("resume")}
          >
            <FaFileAlt />
            Resume Versions
          </TabButton>
        </TabContainer>

        <TabContent>
          {activeTab === "details" && (
            <DetailsForm>
              <FormRow>
                <FormLabel>
                  <FaBuilding />
                  Company
                </FormLabel>
                <FormValue>
                  <div className="value-text">
                    <EditableValue
                      value={job.company}
                      field="company"
                      onSave={handleFieldSave}
                    />
                  </div>
                </FormValue>
              </FormRow>

              <FormRow>
                <FormLabel>
                  <FaSuitcase />
                  Position
                </FormLabel>
                <FormValue>
                  <div className="value-text">
                    <EditableValue
                      value={job.position}
                      field="position"
                      onSave={handleFieldSave}
                    />
                  </div>
                </FormValue>
              </FormRow>

              <FormRow>
                <FormLabel>
                  <FaClipboardList />
                  Status
                </FormLabel>
                <FormValue>
                  <div className="value-text">
                    <EditableValue
                      value={job.status}
                      field="status"
                      onSave={handleFieldSave}
                      options={Object.values(JobStatus)}
                    />
                  </div>
                </FormValue>
              </FormRow>

              <FormRow>
                <FormLabel>
                  <FaCalendarAlt />
                  Applied Date
                </FormLabel>
                <FormValue>
                  <div className="value-text">
                    <EditableValue
                      value={job.applied_date || ""}
                      type="date"
                      field="applied_date"
                      onSave={handleFieldSave}
                    />
                  </div>
                </FormValue>
              </FormRow>

              <FormRow>
                <FormLabel>
                  <FaFileAlt />
                  Notes
                </FormLabel>
                <FormValue>
                  <div className="value-text">
                    <EditableValue
                      value={job.notes || ""}
                      field="notes"
                      onSave={handleFieldSave}
                      multiline
                    />
                  </div>
                </FormValue>
              </FormRow>
            </DetailsForm>
          )}

          {activeTab === "resume" && (
            <ResumeSection>
              <UploadCard onClick={handleFileUpload}>
                <FaCloudUploadAlt />
                <h3>Upload New Resume</h3>
                <p>Drag and drop your file here or click to browse</p>
                <ChooseFileButton>
                  <FaFolder />
                  Choose File
                </ChooseFileButton>
              </UploadCard>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept=".pdf,.doc,.docx"
              />

              <VersionsTable>
                <TableHeader>
                  <span>Version</span>
                  <span>Filename</span>
                  <span>Upload Date</span>
                  <span>Actions</span>
                </TableHeader>

                {job.resumes.map((version) => (
                  <TableRow key={version.id}>
                    <VersionBadge>v{version.version}</VersionBadge>
                    <FileName>
                      <FaFileAlt />
                      {version.filename}
                    </FileName>
                    <UploadDate>
                      {new Date(version.upload_date).toLocaleDateString()}
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
                        $variant="danger"
                        onClick={() => handleDelete(version.id)}
                      >
                        <FaTrash />
                      </ActionButton>
                    </ActionButtons>
                  </TableRow>
                ))}
              </VersionsTable>
            </ResumeSection>
          )}
        </TabContent>
      </MainContainer>

      <DeleteSection>
        <DeleteWarning>
          Deleting this job will permanently remove all associated data and
          resume versions.
        </DeleteWarning>
        <DeleteButton onClick={handleDeleteJob}>
          <FaTrash />
          Delete Job Application
        </DeleteButton>
      </DeleteSection>
    </PageContainer>
  );
};

export default JobDetailPage;
