import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTasks, FaCalendarAlt } from "react-icons/fa";
import type { Job } from "../types/types";

const Card = styled.div`
  /* Glassmorphism Effect */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;

  /* Spacing */
  padding: 2.5rem;
  height: 100%;

  /* Shadow */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  /* Animation */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Hover State */
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
  }
`;

const CompanyName = styled.h5`
  /* Typography */
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};

  /* Spacing */
  margin-bottom: 0.75rem;
`;

const Position = styled.h6`
  /* Typography */
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLight};

  /* Spacing */
  margin-bottom: 1rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  /* Layout */
  padding: 0.5em 1em;
  border-radius: 50px;

  /* Typography */
  font-size: 0.875rem;
  font-weight: 500;

  /* Status-specific styling */
  ${({ $status }) => {
    switch ($status) {
      case "draft":
        return `
          background-color: rgba(165, 180, 252, 0.8); /* #a5b4fc with 80% opacity */
          color: #4338ca;
        `;
      case "applied":
        return `
          background-color: #6366f1;
          color: white;
        `;
      case "interview":
        return `
          background-color: #fbbf24;
          color: #1f2937;
        `;
      case "offer":
        return `
          background-color: #34d399;
          color: white;
        `;
      case "rejected":
        return `
          background-color: #ef4444;
          color: white;
        `;
      case "withdrawn":
        return `
          background-color: #9ca3af;
          color: white;
        `;
      default:
        return "";
    }
  }}
`;

const InfoRow = styled.div`
  /* Layout */
  display: flex;
  align-items: center;
  gap: 0.5rem;

  /* Spacing */
  margin-bottom: 1rem;
`;

const DateInfo = styled.small`
  /* Layout */
  display: flex;
  align-items: center;
  gap: 0.25rem;

  /* Typography */
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ButtonGroup = styled.div`
  /* Layout */
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  /* Layout */
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;

  /* Typography */
  font-size: 0.875rem;
  font-weight: 500;

  /* Styling */
  background: rgba(99, 102, 241, 0.1);
  color: #4338ca;
  border: none;
  cursor: pointer;

  /* Animation */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  /* Hover State */
  &:hover {
    background: rgba(99, 102, 241, 0.15);
    transform: translateY(-1px);
  }

  /* Icon sizing */
  svg {
    font-size: 1rem;
  }
`;

const VersionInfo = styled.small`
  /* Typography */
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const Footer = styled.div`
  /* Layout */
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* Spacing */
  margin-top: 1.5rem;
`;

interface JobCardProps {
  job: Job;
  onView?: (id: string) => void;
  onInterview?: (id: string) => void;
}

export const JobCard = ({ job, onView, onInterview }: JobCardProps) => {
  const navigate = useNavigate();

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) {
      onView(job.id);
    } else {
      navigate(`/jobs/${job.id}`);
    }
  };

  const handleInterview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInterview) {
      onInterview(job.id);
    }
  };

  return (
    <Card>
      <CompanyName>{job.company}</CompanyName>
      <Position>{job.position}</Position>

      <InfoRow>
        <StatusBadge $status={job.status}>{job.status}</StatusBadge>
        <DateInfo>
          <FaCalendarAlt />
          {job.appliedDate || "Not applied"}
        </DateInfo>
      </InfoRow>

      <Footer>
        <ButtonGroup>
          <ActionButton onClick={handleView}>
            <FaEye />
            View
          </ActionButton>
          <ActionButton onClick={handleInterview}>
            <FaTasks />
            Interview
          </ActionButton>
        </ButtonGroup>
        <VersionInfo>{job.resumeVersions} versions</VersionInfo>
      </Footer>
    </Card>
  );
};
