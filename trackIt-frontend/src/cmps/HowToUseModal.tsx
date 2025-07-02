import React from "react";
import styled from "styled-components";
import {
  FaTimes,
  FaLightbulb,
  FaBriefcase,
  FaFileAlt,
  FaFilter,
  FaEdit,
} from "react-icons/fa";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 650px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.colors.text};
    border-color: rgba(255, 255, 255, 0.2);
  }

  svg {
    font-size: 1.25rem;
  }
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2.5rem;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.5px;

  svg {
    color: #6366f1;
    font-size: 1.5rem;
  }
`;

const Section = styled.div`
  margin-bottom: 2.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.08);
  }

  h3 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.25rem;
    margin-bottom: 1.25rem;
    font-weight: 500;

    svg {
      color: #6366f1;
      font-size: 1.125rem;
    }
  }

  p {
    color: ${({ theme }) => theme.colors.textLight};
    line-height: 1.7;
    margin-bottom: 1.25rem;
    font-size: 0.9375rem;
    opacity: 0.9;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;

    li {
      color: ${({ theme }) => theme.colors.textLight};
      padding-left: 1.75rem;
      position: relative;
      font-size: 0.9375rem;
      line-height: 1.6;
      opacity: 0.9;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0.5rem;
        width: 6px;
        height: 6px;
        background: #6366f1;
        border-radius: 50%;
        opacity: 0.8;
      }

      &:hover {
        opacity: 1;

        &::before {
          opacity: 1;
        }
      }
    }
  }
`;

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToUseModal: React.FC<HowToUseModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <Title>
          <FaLightbulb />
          How to Use TrackIt
        </Title>

        <Section>
          <h3>
            <FaBriefcase />
            Overview
          </h3>
          <p>
            TrackIt is your personal job application tracking system. It helps
            you organize and monitor your job search process by keeping track of
            all your applications, resumes, and the status of each position
            you've applied to.
          </p>
        </Section>

        <Section>
          <h3>
            <FaFileAlt />
            Managing Job Applications
          </h3>
          <ul>
            <li>
              Click the "Add Job" button to create a new job application entry
            </li>
            <li>
              Fill in essential details like company name, position, application
              date, and status
            </li>
            <li>
              Upload different versions of your resume for each application
            </li>
            <li>
              Add notes and important details about the application or interview
              process
            </li>
            <li>
              Track the status of your application (Applied, Interview, Offer,
              Rejected, etc.)
            </li>
          </ul>
        </Section>

        <Section>
          <h3>
            <FaFilter />
            Filtering and Organization
          </h3>
          <ul>
            <li>
              Use the filter bar to search for specific companies or positions
            </li>
            <li>Filter applications by their current status</li>
            <li>
              View all your applications in a clean, organized grid layout
            </li>
            <li>
              Click on any job card to view full details and manage the
              application
            </li>
          </ul>
        </Section>

        <Section>
          <h3>
            <FaEdit />
            Managing Details
          </h3>
          <ul>
            <li>View and edit job application details at any time</li>
            <li>Upload and manage multiple versions of your resume</li>
            <li>Track important dates and deadlines</li>
            <li>Add and update notes about interviews or communications</li>
            <li>
              Update the application status as you progress through the hiring
              process
            </li>
          </ul>
        </Section>
      </ModalContent>
    </ModalOverlay>
  );
};
