import React from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaEye, FaCalendarAlt } from "react-icons/fa";
import type { Job } from "../types/types";

const slideInAppear = keyframes`
  0% {
    transform: translateY(-20px) scale(0.95);
    opacity: 0;
    background: rgba(99, 102, 241, 0.2);
  }
  30% {
    transform: translateY(5px) scale(1.02);
    opacity: 1;
    background: rgba(99, 102, 241, 0.15);
  }
  45% {
    transform: translateY(-3px) scale(1.01);
    background: rgba(99, 102, 241, 0.1);
  }
  60% {
    transform: translateY(2px) scale(1);
    background: rgba(99, 102, 241, 0.05);
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
    background: #FFFFFF;
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
  $status: string;
}

// Main card container with accent status bar
const Card = styled.div<CardProps>`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  min-height: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;

  /* Accent status bar on left edge */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: ${({ $status }) => {
      switch ($status.toLowerCase()) {
        case "applied":
          return "#6366F1"; // Indigo
        case "interviewing":
          return "#F59E0B"; // Amber
        case "rejected":
          return "#EF4444"; // Red
        case "accepted":
          return "#10B981"; // Green
        case "pending":
          return "#8B5CF6"; // Purple
        default:
          return "#6B7280"; // Gray
      }
    }};
  }

  ${({ $isNew }) =>
    $isNew &&
    css`
      animation: ${slideInAppear} 1.2s cubic-bezier(0.23, 1, 0.32, 1);

      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(99, 102, 241, 0.2),
          transparent
        );
        background-size: 200% 100%;
        animation: ${shimmerHighlight} 1.5s ease-in-out;
        pointer-events: none;
      }
    `}

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 20px;
    min-height: 280px;
  }
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// Status badge positioned in top-right corner
const StatusBadge = styled.span<{ $status: string }>`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background: ${({ $status }) => {
    switch ($status.toLowerCase()) {
      case "applied":
        return "#6366F1"; // Indigo
      case "interviewing":
        return "#F59E0B"; // Amber
      case "rejected":
        return "#EF4444"; // Red
      case "accepted":
        return "#10B981"; // Green
      case "pending":
        return "#8B5CF6"; // Purple
      default:
        return "#6B7280"; // Gray
    }
  }};
`;

// Company name (title)
const CompanyName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  margin-top: 0;
  line-height: 1.3;

  /* Mobile styles */
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 10px;
  }
`;

// Position (subtitle)
const Position = styled.h4`
  font-size: 16px;
  font-weight: 400;
  color: #4b5563;
  margin-bottom: 12px;
  margin-top: 0;
  line-height: 1.4;

  /* Mobile styles */
  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 10px;
  }
`;

// Notes with 3-line limit
const Notes = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #4b5563;
  margin-bottom: 12px;
  margin-top: 0;
  line-height: 1.5;

  /* Limit to 3 lines with ellipsis */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Mobile styles */
  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 10px;
  }
`;

// Metadata section with dates
const Metadata = styled.div`
  margin-top: auto;
  margin-bottom: 16px;
`;

const DateInfo = styled.div`
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }

  svg {
    font-size: 12px;
    opacity: 0.7;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

// View Details button
const ViewDetailsButton = styled.button`
  width: 100%;
  padding: 12px 24px;
  background: transparent;
  border: 1px solid #4f46e5;
  border-radius: 12px;
  color: #4f46e5;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: auto;

  &:hover {
    background: rgba(79, 70, 229, 0.1);
    transform: translateY(-1px);
  }

  &:focus {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }

  svg {
    font-size: 14px;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 13px;
  }
`;

interface JobCardProps {
  job: Job;
  isNew?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, isNew = false }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card
      onClick={() => navigate(`/jobs/${job.id}`)}
      $isNew={isNew}
      $status={job.status}
    >
      {/* Status Badge */}
      <StatusBadge $status={job.status}>
        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
      </StatusBadge>

      <CardContent>
        {/* Company Name */}
        <CompanyName>{job.company}</CompanyName>

        {/* Position */}
        <Position>{job.position}</Position>

        {/* Notes (if available) */}
        {job.notes && <Notes>{job.notes}</Notes>}

        {/* Metadata */}
        <Metadata>
          {job.applied_date && (
            <DateInfo>📅 Applied: {formatDate(job.applied_date)}</DateInfo>
          )}
          <DateInfo>📅 Created: {formatDate(job.created_at)}</DateInfo>
        </Metadata>

        {/* View Details Button */}
        <ViewDetailsButton>
          <FaEye />
          View Details
        </ViewDetailsButton>
      </CardContent>
    </Card>
  );
};
