import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaFileAlt,
  FaCloudUploadAlt,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import { JobStatus, type Job } from "../types/types";
import { api } from "../api/config.js";
import { useJobs } from "../context/JobContext";
import { useAuth } from "../context/AuthContext";

// Overall container with light neutral background
const PageContainer = styled.div`
  min-height: 100vh;
  background: #fafbfc; // Cream-white background
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

// Centered card with max-width and generous margin
const CardContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  width: 100%;
  overflow: hidden;
`;

// Tabs navigation
const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: 1rem 1.5rem;
  background: ${({ $isActive }) => ($isActive ? "#ffffff" : "#f8fafc")};
  border: none;
  border-bottom: 3px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : "transparent"};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.textLight};
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ $isActive }) => ($isActive ? "#ffffff" : "#f1f5f9")};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }

  svg {
    font-size: 1rem;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;

    svg {
      font-size: 0.875rem;
    }
  }
`;

// Tab content container
const TabContent = styled.div`
  padding: 2rem;

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

// Section header
const SectionHeader = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #334155;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.25rem;

    svg {
      font-size: 1.125rem;
    }
  }
`;

// Form group with consistent spacing
const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 0.5rem;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    margin-bottom: 0.875rem;

    label {
      font-size: 0.8125rem;
      margin-bottom: 0.375rem;
    }
  }
`;

// Input styles
const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.875rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #334155;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
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
  font-size: 0.875rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  option {
    background: white;
    color: #334155;
    padding: 12px;
    font-size: 0.875rem;
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
  font-size: 0.875rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #334155;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 1rem;
    min-height: 120px;
  }
`;

// Side-by-side layout for status and date
const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  /* Mobile styles */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }
`;

// Upload area for resume tab
const UploadArea = styled.div`
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: #f8fafc;
  }

  svg {
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1rem;
    font-weight: 500;
    margin: 0.5rem 0;
    color: #334155;
  }

  p {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0.25rem 0;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 1.5rem;

    svg {
      font-size: 2rem;
    }

    h3 {
      font-size: 0.9375rem;
    }

    p {
      font-size: 0.8125rem;
    }
  }
`;

// Browse files button
const BrowseButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #334155;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 1rem;
  }
`;

// Selected file container
const SelectedFileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
`;

const FileName = styled.p`
  margin: 0;
  color: #334155;
  font-size: 0.875rem;
  font-weight: 500;
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
  font-size: 0.8125rem;
  transition: all 0.2s ease;
  border-radius: 4px;

  &:hover {
    background: #fef2f2;
  }

  svg {
    font-size: 0.875rem;
  }
`;

// Submit button aligned bottom right
const SubmitButton = styled.button`
  padding: 0.875rem 2rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  margin-left: auto; // Align to the right

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    margin-top: 1.5rem;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 1rem;
  font-size: 0.875rem;
  text-align: center;
  background: #fef2f2;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #fecaca;
`;

// Tab types
type TabType = "details" | "resume";

const NewJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, setJobs } = useJobs();
  const { isGuest } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: JobStatus.PENDING,
    applied_date: "",
    notes: "",
  });
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (isGuest) {
        // For guest users, create job locally without sending to server
        const newJob: Job = {
          id: Date.now(), // Generate a temporary ID
          company: formData.company,
          position: formData.position,
          status: formData.status,
          notes: formData.notes || "",
          applied_date: formData.applied_date
            ? new Date(formData.applied_date).toISOString()
            : undefined,
          created_at: new Date().toISOString(),
          resumes: [], // Guest mode doesn't support resume uploads
        };

        // Update jobs context with the new job
        setJobs([...jobs, newJob]);

        // Navigate to jobs list with the new job ID
        navigate("/jobs", { state: { newJobId: newJob.id } });
        return;
      }

      // For authenticated users, send to server
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

      const { data } = await api.post("/api/jobs/", formDataToSend, {
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

  const handleFileUpload = () => {
    const fileInput = document.getElementById("resume") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <PageContainer>
      <CardContainer>
        {/* Tabs Navigation */}
        <TabContainer>
          <TabButton
            $isActive={activeTab === "details"}
            onClick={() => setActiveTab("details")}
          >
            <FaBriefcase />
            Job Details
          </TabButton>
          <TabButton
            $isActive={activeTab === "resume"}
            onClick={() => setActiveTab("resume")}
          >
            <FaFileAlt />
            Resume
          </TabButton>
        </TabContainer>

        {/* Tab Content */}
        <TabContent>
          {activeTab === "details" && (
            <form onSubmit={handleSubmit}>
              <SectionHeader>
                <FaBriefcase />
                Job Details
              </SectionHeader>

              {/* Company & Position - stacked inputs */}
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

              {/* Status & Date picker - side-by-side */}
              <Row>
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
                  <Input
                    type="date"
                    id="applied_date"
                    name="applied_date"
                    value={formData.applied_date}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </FormGroup>
              </Row>

              {/* Notes - full-width textarea */}
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

              {/* Action button - aligned bottom right */}
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Job Application"}
              </SubmitButton>

              {error && <ErrorMessage>{error}</ErrorMessage>}
            </form>
          )}

          {activeTab === "resume" && (
            <div>
              <SectionHeader>
                <FaFileAlt />
                Upload Resume
              </SectionHeader>

              {/* Upload zone */}
              <label htmlFor="resume">
                <UploadArea>
                  <FaCloudUploadAlt />
                  <h3>Drag and drop your resume here</h3>
                  <p>or click to browse files</p>
                  <p>Supported formats: PDF, DOC, DOCX</p>
                </UploadArea>
              </label>

              {/* Hidden file input */}
              <input
                type="file"
                id="resume"
                name="resume"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
              />

              {/* Browse files button */}
              <BrowseButton type="button" onClick={handleFileUpload}>
                Browse Files
              </BrowseButton>

              {/* Selected file display */}
              {resume && (
                <SelectedFileContainer>
                  <FileName>{resume.name}</FileName>
                  <RemoveButton onClick={handleRemoveFile}>
                    <FaTrash />
                    Remove
                  </RemoveButton>
                </SelectedFileContainer>
              )}
            </div>
          )}
        </TabContent>
      </CardContainer>
    </PageContainer>
  );
};

export default NewJobPage;
