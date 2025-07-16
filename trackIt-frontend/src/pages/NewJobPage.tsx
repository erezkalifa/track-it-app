import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaFileAlt,
  FaCloudUploadAlt,
  FaEye,
  FaDownload,
  FaTrash,
  FaFolder,
  FaTimes,
} from "react-icons/fa";
import { JobStatus } from "../types/types";
import { api } from "../api/config.js";
import { useJobs } from "../context/JobContext";

const PageContainer = styled.div`
  padding: 2rem;
  display: grid;
  grid-template-columns: minmax(350px, 2fr) minmax(600px, 3fr);
  gap: 2rem;

  /* Tablet styles */
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 1rem;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const CardContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  height: fit-content;

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

// Mobile Resume Modal
const MobileResumeModal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;
  padding: 1rem;

  /* Hide on desktop */
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileResumeSheet = styled.div<{ $isOpen: boolean }>`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  transform: scale(${({ $isOpen }) => ($isOpen ? "1" : "0.9")})
    translateY(${({ $isOpen }) => ($isOpen ? "0" : "20px")});
  transition: all 0.3s ease;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const MobileResumeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-top: 0.5rem;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #000;
    margin: 0;
  }

  button {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    svg {
      font-size: 1.25rem;
    }
  }
`;

// Mobile Resume Button
const MobileResumeButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  svg {
    font-size: 1.125rem;
  }

  /* Hide on desktop */
  @media (min-width: 769px) {
    display: none;
  }
`;

// Desktop Resume Container
const DesktopResumeContainer = styled.div`
  /* Hide on mobile */
  @media (max-width: 768px) {
    display: none;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};

  svg {
    font-size: 1.5rem;
    opacity: 0.8;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;

    h2 {
      font-size: 1.25rem;
    }

    svg {
      font-size: 1.25rem;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    font-size: 0.9375rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textLight};
    margin-bottom: 0.75rem;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    margin-bottom: 1.25rem;

    label {
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
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

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 1rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.9375rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover,
  &:focus {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    outline: none;
  }

  option {
    background: white;
    color: #1a1a1a;
    padding: 12px;
    font-size: 0.9375rem;
    line-height: 1.5;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 1rem;
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
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;

  &:hover,
  &:focus {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    outline: none;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 1rem;
    min-height: 120px;
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

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 1.5rem;

    svg {
      font-size: 1.75rem;
    }

    h3 {
      font-size: 1rem;
    }

    p {
      font-size: 0.8125rem;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;

  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 1.125rem;
    font-size: 1.125rem;
    margin-top: 1.5rem;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 1rem;
  font-size: 0.9rem;
  text-align: center;
`;

const DateInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.9375rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.6;
    cursor: pointer;
  }

  &:hover,
  &:focus {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    outline: none;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 1rem;
  }
`;

const SelectedFileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
`;

const FileName = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const NewJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, setJobs } = useJobs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [isMobileResumeOpen, setIsMobileResumeOpen] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: JobStatus.PENDING,
    applied_date: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Convert status to lowercase string if it's not already
      const jobData = {
        ...formData,
        status: (formData.status?.toString() || "pending").toLowerCase(),
        // Only include applied_date if it's not empty
        ...(formData.applied_date && { applied_date: formData.applied_date }),
      };

      // Append each field individually to FormData
      Object.entries(jobData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formDataToSend.append(key, value.toString());
        }
      });

      if (resume) {
        formDataToSend.append("resume", resume);
      }

      const { data } = await api.post("/api/jobs", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update jobs context with the new job
      setJobs([...jobs, data]);

      // Navigate to jobs list with the new job ID
      navigate("/jobs", { state: { newJobId: data.id } });
    } catch (error: any) {
      console.error("Error creating job:", error.response?.data || error);
      let errorMessage = "Failed to create job. Please try again.";

      if (error.response?.data?.detail) {
        // Handle validation errors
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail
            .map((err: any) => err.msg)
            .join(", ");
        } else {
          errorMessage = error.response.data.detail;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFile = () => {
    setResume(null);
    // Reset the file input
    const fileInput = document.getElementById("resume") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleMobileResumeOpen = () => {
    setIsMobileResumeOpen(true);
  };

  const handleMobileResumeClose = () => {
    setIsMobileResumeOpen(false);
  };

  return (
    <>
      <PageContainer>
        <CardContainer>
          <CardHeader>
            <FaBriefcase />
            <h2>New Job Application</h2>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="company">Company</label>
              <Input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="position">Position</label>
              <Input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="status">Application Status</label>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                {Object.values(JobStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <label htmlFor="applied_date">Applied Date</label>
              <DateInput
                type="date"
                id="applied_date"
                name="applied_date"
                value={formData.applied_date}
                onChange={handleInputChange}
                max={new Date().toISOString().split("T")[0]}
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="notes">Notes</label>
              <TextArea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any relevant notes about the position..."
              />
            </FormGroup>

            {/* Mobile Resume Button */}
            <MobileResumeButton type="button" onClick={handleMobileResumeOpen}>
              <FaFileAlt />
              Resume Versions
            </MobileResumeButton>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Job Application"}
            </SubmitButton>

            {error && <ErrorMessage>{error}</ErrorMessage>}
          </form>
        </CardContainer>

        {/* Desktop Resume Container */}
        <DesktopResumeContainer>
          <CardContainer>
            <CardHeader>
              <FaFileAlt />
              <h2>Resume</h2>
            </CardHeader>

            <label htmlFor="resume">
              <UploadArea>
                <FaCloudUploadAlt />
                <h3>Upload Resume</h3>
                <p>Drag and drop your resume here or click to browse</p>
                <p>Supported formats: PDF, DOC, DOCX</p>
              </UploadArea>
            </label>
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
            />

            {resume && (
              <SelectedFileContainer>
                <FileName>{resume.name}</FileName>
                <RemoveButton onClick={handleRemoveFile}>
                  <FaTrash />
                  Remove
                </RemoveButton>
              </SelectedFileContainer>
            )}
          </CardContainer>
        </DesktopResumeContainer>
      </PageContainer>

      {/* Mobile Resume Modal */}
      <MobileResumeModal
        $isOpen={isMobileResumeOpen}
        onClick={handleMobileResumeClose}
      >
        <MobileResumeSheet
          $isOpen={isMobileResumeOpen}
          onClick={(e) => e.stopPropagation()}
        >
          <MobileResumeHeader>
            <h3>Resume Versions</h3>
            <button onClick={handleMobileResumeClose}>
              <FaTimes />
            </button>
          </MobileResumeHeader>

          <label htmlFor="mobile-resume">
            <UploadArea>
              <FaCloudUploadAlt />
              <h3>Upload Resume</h3>
              <p>Drag and drop your resume here or click to browse</p>
              <p>Supported formats: PDF, DOC, DOCX</p>
            </UploadArea>
          </label>
          <input
            type="file"
            id="mobile-resume"
            name="resume"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            style={{ display: "none" }}
          />

          {resume && (
            <SelectedFileContainer>
              <FileName>{resume.name}</FileName>
              <RemoveButton onClick={handleRemoveFile}>
                <FaTrash />
                Remove
              </RemoveButton>
            </SelectedFileContainer>
          )}
        </MobileResumeSheet>
      </MobileResumeModal>
    </>
  );
};

export default NewJobPage;
