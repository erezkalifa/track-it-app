import React from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaEye, FaCalendarAlt } from "react-icons/fa";
import type { Job } from "../types/types";

const slideInAppear = keyframes`
  0% {
    transform: translateY(-20px) scale(0.95);
    opacity: 0;
    background: rgba(147, 51, 234, 0.2);
  }
  30% {
    transform: translateY(5px) scale(1.02);
    opacity: 1;
    background: rgba(147, 51, 234, 0.15);
  }
  45% {
    transform: translateY(-3px) scale(1.01);
    background: rgba(147, 51, 234, 0.1);
  }
  60% {
    transform: translateY(2px) scale(1);
    background: rgba(147, 51, 234, 0.05);
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const shimmerHighlight = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

interface CardProps {
  $isNew: boolean;
}

const Card = styled.div<CardProps>`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  ${({ $isNew }) =>
    $isNew &&
    css`
      animation: ${slideInAppear} 1.2s cubic-bezier(0.23, 1, 0.32, 1);

      &::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(147, 51, 234, 0.2),
          transparent
        );
        background-size: 200% 100%;
        animation: ${shimmerHighlight} 1.5s ease-in-out;
        pointer-events: none;
      }
    `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  /* Glassmorphism Effect */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  /* Layout */
  height: 100%;

  /* Shadow */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const CardContent = styled.div`
  flex: 1;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
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
  min-height: 3.5rem;
`;

interface JobCardProps {
  job: Job;
  isNew?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, isNew = false }) => {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/jobs/${job.id}`)} $isNew={isNew}>
      <CardContent>
        <CompanyName>{job.company}</CompanyName>
        <Position>{job.position}</Position>
        <InfoRow>
          <StatusBadge $status={job.status.toLowerCase()}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </StatusBadge>
        </InfoRow>

        {job.notes && <Notes>{job.notes}</Notes>}

        <DateGroup>
          {job.applied_date && (
            <DateInfo>
              <FaCalendarAlt /> Applied:{" "}
              {new Date(job.applied_date).toLocaleDateString()}
            </DateInfo>
          )}
          <DateInfo>
            <FaCalendarAlt /> Created:{" "}
            {new Date(job.created_at).toLocaleDateString()}
          </DateInfo>
        </DateGroup>
      </CardContent>

      <ButtonGroup>
        <ActionButton>
          <FaEye />
          View Details
        </ActionButton>
      </ButtonGroup>
    </Card>
  );
};
