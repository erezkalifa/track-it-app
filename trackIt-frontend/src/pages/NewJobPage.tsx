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
} from "react-icons/fa";
import { JobStatus } from "../types/types";

const PageContainer = styled.div`
  padding: 2rem;
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
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  height: fit-content;
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
    background: #1a1a1a;
    color: ${({ theme }) => theme.colors.text};
  }
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
`;

const SaveButton = styled.button`
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

export const NewJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: JobStatus.DRAFT,
    appliedDate: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // TODO: Implement job creation logic
    // For now, just navigate back to jobs list
    navigate("/jobs");
  };

  const handleFileUpload = () => {
    // TODO: Implement file upload logic
  };

  return (
    <PageContainer>
      <CardContainer>
        <CardHeader>
          <FaBriefcase />
          <h2>New Job Application</h2>
        </CardHeader>

        <FormGroup>
          <label>Company Name</label>
          <Input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Enter company name"
          />
        </FormGroup>

        <FormGroup>
          <label>Position</label>
          <Input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            placeholder="Enter position title"
          />
        </FormGroup>

        <FormGroup>
          <label>Application Status</label>
          <Select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            {Object.values(JobStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <label>Applied Date</label>
          <DateInput
            type="date"
            name="appliedDate"
            value={formData.appliedDate}
            onChange={handleInputChange}
          />
        </FormGroup>

        <SaveButton onClick={handleSubmit}>Save Job Application</SaveButton>
      </CardContainer>

      <CardContainer>
        <CardHeader>
          <FaFileAlt />
          <h2>Upload Resume</h2>
        </CardHeader>

        <UploadArea onClick={handleFileUpload}>
          <FaCloudUploadAlt />
          <h3>Upload Resume</h3>
          <p>Drag and drop your file here or click to browse</p>
          <ChooseFileButton>
            <FaFolder />
            Choose File
          </ChooseFileButton>
        </UploadArea>
      </CardContainer>
    </PageContainer>
  );
};
