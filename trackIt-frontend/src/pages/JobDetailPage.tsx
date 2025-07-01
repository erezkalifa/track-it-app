import React, { useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
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

const ManageButton = styled.button`
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

  small {
    font-size: 0.875rem;
    opacity: 0.9;
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

const mockResumeVersions = [
  {
    version: 1,
    filename: "Erez_Kalifa_Software_Support_Specialist_1.pdf",
    upload_date: "2023-07-01 09:31",
  },
];

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<JobStatus>(JobStatus.DRAFT);
  const [appliedDate, setAppliedDate] = useState<string>("");

  const handleFileUpload = () => {
    // Handle file upload logic
  };

  return (
    <PageContainer>
      <CardContainer>
        <CardHeader>
          <FaBriefcase />
          <h2>Job Details</h2>
        </CardHeader>

        <FormGroup>
          <label>Application Status</label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as JobStatus)}
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
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            placeholder="dd/mm/yyyy"
          />
        </FormGroup>

        <ManageButton>
          <span>Manage Interview Process</span>
          <small>Track stages and progress</small>
        </ManageButton>
      </CardContainer>

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

          {mockResumeVersions.map((version) => (
            <VersionRow key={version.version}>
              <VersionBadge>v{version.version}</VersionBadge>
              <FileName>
                <FaFileAlt />
                <span>{version.filename}</span>
              </FileName>
              <UploadDate>{version.upload_date}</UploadDate>
              <ActionButtons>
                <ActionButton title="View">
                  <FaEye />
                </ActionButton>
                <ActionButton title="Download">
                  <FaDownload />
                </ActionButton>
                <ActionButton title="Delete" className="delete">
                  <FaTrash />
                </ActionButton>
              </ActionButtons>
            </VersionRow>
          ))}
        </VersionsTable>
      </CardContainer>
    </PageContainer>
  );
};

export default JobDetailPage;
