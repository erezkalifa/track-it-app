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
} from "react-icons/fa";
import { JobStatus } from "../types/types";
import type { Job } from "../types/types";
import type { ResumeVersion } from "../types/types";
import { api } from "../api/config.js";
import { useJobs } from "../context/JobContext";
import { useAuth } from "../context/AuthContext";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  /* Mobile styles */
  @media (max-width: 768px) {
    gap: 1rem;
  }

  /* Small mobile styles */
  @media (max-width: 399px) {
    gap: 0.75rem;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1rem;

  /* Mobile styles */
  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  /* Small mobile styles */
  @media (max-width: 399px) {
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

const HeaderActions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1rem;

  /* Mobile styles */
  @media (max-width: 768px) {
    gap: 0.5rem;
  }

  /* Small mobile styles */
  @media (max-width: 399px) {
    gap: 0.25rem;
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  span {
    font-size: 1.25rem;
    line-height: 1;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;

    span {
      font-size: 1.125rem;
    }
  }

  /* Small mobile styles */
  @media (max-width: 399px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    white-space: nowrap;

    span {
      font-size: 1rem;
    }
  }
`;

const SaveButton = styled.button<{ $isSaved: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: ${({ $isSaved }) =>
    $isSaved
      ? "rgba(var(--color-primary-rgb), 0.15)"
      : "rgba(255, 255, 255, 0.05)"};
  border: 1px solid
    ${({ $isSaved }) =>
      $isSaved
        ? "rgba(var(--color-primary-rgb), 0.3)"
        : "rgba(255, 255, 255, 0.1)"};
  border-radius: 12px;
  color: ${({ theme, $isSaved }) =>
    $isSaved ? theme.colors.primary : theme.colors.text};
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: ${({ $isSaved }) => ($isSaved ? "default" : "pointer")};
  transition: all 0.2s ease;
  pointer-events: ${({ $isSaved }) => ($isSaved ? "none" : "auto")};

  svg {
    font-size: 1rem;
    color: ${({ theme, $isSaved }) =>
      $isSaved ? theme.colors.primary : theme.colors.textLight};
  }

  &:hover {
    background: ${({ $isSaved }) =>
      $isSaved
        ? "rgba(var(--color-primary-rgb), 0.15)"
        : "rgba(255, 255, 255, 0.08)"};
    border-color: ${({ $isSaved }) =>
      $isSaved
        ? "rgba(var(--color-primary-rgb), 0.3)"
        : "rgba(255, 255, 255, 0.15)"};
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    gap: 0.5rem;

    svg {
      font-size: 0.875rem;
    }
  }

  /* Small mobile styles */
  @media (max-width: 399px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    gap: 0.375rem;
    white-space: nowrap;

    svg {
      font-size: 0.75rem;
    }
  }
`;

const CardsContainer = styled.div`
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
  min-width: 400px;
  width: 100%;

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 1.5rem;
    min-width: unset;
  }

  /* Small mobile styles */
  @media (max-width: 399px) {
    padding: 1rem;
    border-radius: 12px;
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
  max-width: 600px;
  max-height: 90vh;
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

  /* Mobile styles */
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;

    h2 {
      font-size: 1.125rem;
    }

    svg {
      font-size: 1.25rem;
    }
  }
`;

const DetailsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;

  /* Mobile styles */
  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 1rem;
  }
`;

const FormGroup = styled.div`
  background: rgba(255, 255, 255, 0.02);
  padding: 0.5rem 1rem;
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
    font-size: 1.125rem;
    color: ${({ theme }) => theme.colors.textLight};
    opacity: 0.8;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textLight};
    opacity: 0.8;
    min-width: 70px;
  }

  .value {
    font-size: 0.875rem;
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
    padding: 0.75rem 1rem;

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

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.5rem;

    label {
      font-size: 0.8125rem;
      min-width: 60px;
    }

    .value {
      font-size: 0.8125rem;
    }

    svg {
      font-size: 1rem;
    }
  }

  /* Small mobile styles */
  @media (max-width: 399px) {
    padding: 0.5rem;
    gap: 0.375rem;

    label {
      font-size: 0.75rem;
      min-width: 50px;
    }

    .value {
      font-size: 0.75rem;
    }

    svg {
      font-size: 0.875rem;
    }

    &.notes {
      padding: 0.5rem;

      .value {
        font-size: 0.75rem;
        max-height: 60px;
      }
    }
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

  /* Small mobile styles */
  @media (max-width: 399px) {
    padding: 1rem;

    svg {
      font-size: 1.5rem;
    }

    h3 {
      font-size: 0.875rem;
    }

    p {
      font-size: 0.75rem;
    }
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

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.875rem;

    svg {
      font-size: 1rem;
    }
  }

  /* Small mobile styles */
  @media (max-width: 399px) {
    padding: 0.625rem;
    font-size: 0.8125rem;

    svg {
      font-size: 0.875rem;
    }
  }
`;

const VersionsTable = styled.div`
  margin-top: 2rem;

  /* Mobile styles */
  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }
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

  /* Mobile styles */
  @media (max-width: 768px) {
    grid-template-columns: 50px 1fr 80px 80px;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;

    span {
      font-size: 0.75rem;
    }
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

  /* Mobile styles */
  @media (max-width: 768px) {
    grid-template-columns: 50px 1fr 80px 80px;
    gap: 0.25rem;
    padding: 0.75rem;
  }
`;

const VersionBadge = styled.span`
  background: rgba(99, 102, 241, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
  }
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

  /* Mobile styles */
  @media (max-width: 768px) {
    gap: 0.5rem;

    svg {
      font-size: 1rem;
    }

    span {
      font-size: 0.8125rem;
      width: 15ch;
    }
  }
`;

const UploadDate = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};

  /* Mobile styles */
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.25rem;
  justify-content: flex-end;

  /* Mobile styles */
  @media (max-width: 768px) {
    gap: 0.125rem;
  }
`;

const ActionButton = styled.button<{
  $variant?: "primary" | "secondary" | "danger";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  width: 32px;
  height: 32px;
  background: ${({ theme, $variant }) => {
    switch ($variant) {
      case "primary":
        return theme.colors.primary;
      case "danger":
        return "rgba(239, 68, 68, 0.1)";
      case "secondary":
      default:
        return "rgba(255, 255, 255, 0.05)";
    }
  }};
  border: 1px solid
    ${({ theme, $variant }) => {
      switch ($variant) {
        case "primary":
          return "transparent";
        case "danger":
          return "rgba(239, 68, 68, 0.2)";
        case "secondary":
        default:
          return "rgba(255, 255, 255, 0.1)";
      }
    }};
  border-radius: 8px;
  color: ${({ theme, $variant }) => {
    switch ($variant) {
      case "primary":
        return "white";
      case "danger":
        return theme.colors.danger;
      case "secondary":
      default:
        return theme.colors.text;
    }
  }};
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;

  svg {
    font-size: 1rem;
    color: ${({ theme, $variant }) => {
      switch ($variant) {
        case "primary":
          return "white";
        case "danger":
          return theme.colors.danger;
        case "secondary":
        default:
          return theme.colors.primary;
      }
    }};
  }

  &:hover {
    background: ${({ theme, $variant }) => {
      switch ($variant) {
        case "primary":
          return `${theme.colors.primary}dd`;
        case "danger":
          return "rgba(239, 68, 68, 0.15)";
        case "secondary":
        default:
          return "rgba(255, 255, 255, 0.08)";
      }
    }};
    border-color: ${({ theme, $variant }) => {
      switch ($variant) {
        case "primary":
          return "transparent";
        case "danger":
          return "rgba(239, 68, 68, 0.3)";
        case "secondary":
        default:
          return "rgba(255, 255, 255, 0.15)";
      }
    }};
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    padding: 0.375rem;

    svg {
      font-size: 0.875rem;
    }
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

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-top: 0.5rem;
  }
`;

const DeleteWarning = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 1rem;
  font-size: 0.9375rem;

  /* Mobile styles */
  @media (max-width: 768px) {
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }
`;

const DeleteJobButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
  }

  svg {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.danger};
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
    gap: 0.5rem;

    svg {
      font-size: 0.875rem;
    }
  }
`;

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
    background: rgba(var(--color-primary-rgb), 0.03);

    .value {
      color: ${({ theme }) => theme.colors.primary};
      opacity: 1;
    }
    .edit-icon {
      color: ${({ theme }) => theme.colors.primary};
      opacity: 0.9;
    }
  }

  &.editing {
    border: 1px solid ${({ theme }) => theme.colors.primary};
    background: rgba(var(--color-primary-rgb), 0.03);
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
    font-size: 0.875rem;
  }
`;

const EditIcon = styled.div`
  font-size: 1rem;
  opacity: 0.6;
  transition: color 0.2s ease, opacity 0.2s ease;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  width: 100%;

  &:focus {
    outline: none;
  }
`;

const Select = styled.select`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  width: 100%;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  option {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const TextArea = styled.textarea`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  width: 100%;
  min-height: 100px;
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
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
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
          <span>←</span> Back to Jobs
        </BackButton>
        <SaveButton onClick={() => setIsSaved(!isSaved)} $isSaved={isSaved}>
          {isSaved ? <FaBookmark /> : <FaRegBookmark />}
          {isSaved ? "Saved" : "Save Job"}
        </SaveButton>
      </HeaderContainer>

      <CardsContainer>
        <CardContainer>
          <CardHeader>
            <FaBriefcase />
            <h2>Job Details</h2>
          </CardHeader>

          <DetailsGrid>
            <FormGroup>
              <FaBuilding />
              <label>Company</label>
              <EditableValue
                value={job.company}
                field="company"
                onSave={handleFieldSave}
              />
            </FormGroup>

            <FormGroup>
              <FaSuitcase />
              <label>Position</label>
              <EditableValue
                value={job.position}
                field="position"
                onSave={handleFieldSave}
              />
            </FormGroup>

            <FormGroup>
              <FaClipboardList />
              <label>Status</label>
              <EditableValue
                value={job.status}
                field="status"
                onSave={handleFieldSave}
                options={Object.values(JobStatus)}
              />
            </FormGroup>

            <FormGroup>
              <FaCalendarAlt />
              <label>Applied</label>
              <EditableValue
                value={job.applied_date || ""}
                type="date"
                field="applied_date"
                onSave={handleFieldSave}
              />
            </FormGroup>

            <FormGroup style={{ alignItems: "flex-start" }}>
              <FaFileAlt />
              <label>Notes</label>
              <EditableValue
                value={job.notes || ""}
                field="notes"
                onSave={handleFieldSave}
                multiline
              />
            </FormGroup>
          </DetailsGrid>

          {/* Mobile Resume Button */}
          <MobileResumeButton onClick={() => setIsResumeModalOpen(true)}>
            <FaFileAlt />
            Resume Versions
          </MobileResumeButton>
        </CardContainer>

        <DesktopResumeContainer>
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
        </DesktopResumeContainer>
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

      {/* Mobile Resume Modal */}
      <MobileResumeModal
        $isOpen={isResumeModalOpen}
        onClick={() => setIsResumeModalOpen(false)}
      >
        <MobileResumeSheet
          $isOpen={isResumeModalOpen}
          onClick={(e) => e.stopPropagation()}
        >
          <MobileResumeHeader>
            <h3>Resume Versions</h3>
            <button onClick={() => setIsResumeModalOpen(false)}>
              <FaTimes />
            </button>
          </MobileResumeHeader>

          <UploadArea onClick={handleFileUpload}>
            <FaCloudUploadAlt />
            <h3>Upload New Resume</h3>
            <p>Drag and drop your file here or click to browse</p>
            <ChooseFileButton>
              <FaFolder />
              Choose File
            </ChooseFileButton>
          </UploadArea>
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
        </MobileResumeSheet>
      </MobileResumeModal>
    </PageContainer>
  );
};

export default JobDetailPage;
