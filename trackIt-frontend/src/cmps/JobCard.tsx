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
  transition: background-color 0.2s ease;

  /* Hover State */
  &:hover {
    background: rgba(255, 255, 255, 0.04);
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
      case "pending":
        return `
          background-color: rgba(165, 180, 252, 0.8);
          color: #4338ca;
        `;
      case "applied":
        return `
          background-color: #6366f1;
          color: white;
        `;
      case "interviewing":
        return `
          background-color: #fbbf24;
          color: #1f2937;
        `;
      case "accepted":
        return `
          background-color: #34d399;
          color: white;
        `;
      case "rejected":
        return `
          background-color: #ef4444;
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

const Footer = styled.div`
  /* Layout */
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const ActionButton = styled.button`
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  height: 2.25rem;
  padding: 0 1.25rem;

  /* Typography */
  font-size: 0.8125rem;
  font-weight: 500;

  /* Styling */
  background: rgba(255, 255, 255, 0.12);
  color: ${({ theme }) => theme.colors.text};
  border: none;
  border-radius: 8px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15),
    0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;

  /* Icon styling */
  svg {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textLight};
  }

  /* Hover State */
  &:hover {
    background: rgba(255, 255, 255, 0.16);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25),
      0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /* Active State */
  &:active {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }
`;

const VersionInfo = styled.small`
  /* Typography */
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const Notes = styled.p`
  /* Typography */
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 1rem 0;

  /* Truncate long text */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DateGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
`;

interface JobCardProps {
  job: Job;
  onView?: (id: number) => void;
}

export const JobCard = ({ job, onView }: JobCardProps) => {
  const navigate = useNavigate();

  const handleView = (e: React.MouseEvent) => {
    if (onView) {
      onView(job.id);
    } else {
      navigate(`/jobs/${job.id}`);
    }
  };

  return (
    <Card>
      <CompanyName>{job.company}</CompanyName>
      <Position>{job.position}</Position>

      <InfoRow>
        <StatusBadge $status={job.status}>{job.status}</StatusBadge>
      </InfoRow>

      {job.notes && <Notes>{job.notes}</Notes>}

      <DateGroup>
        <DateInfo>
          <FaCalendarAlt />
          Created: {new Date(job.created_at).toLocaleDateString()}
        </DateInfo>
        {job.updated_at && (
          <DateInfo>
            <FaCalendarAlt />
            Last Updated: {new Date(job.updated_at).toLocaleDateString()}
          </DateInfo>
        )}
      </DateGroup>

      <Footer>
        <ActionButton onClick={handleView}>
          <FaEye />
          View Details
        </ActionButton>
      </Footer>
    </Card>
  );
};
