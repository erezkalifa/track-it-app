import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import {
  FaTimes,
  FaLightbulb,
  FaBriefcase,
  FaFileAlt,
  FaFilter,
  FaEdit,
  FaChevronRight,
} from "react-icons/fa";

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.2), 0 0 20px rgba(99, 102, 241, 0.1); }
  50% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.4), 0 0 40px rgba(99, 102, 241, 0.2); }
  100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.2), 0 0 20px rgba(99, 102, 241, 0.1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const progressAnimation = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(249, 250, 251, 0.95)
  );
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
`;

const ModalContent = styled.div`
  position: relative;
  width: 90%;
  max-width: 1000px;
  min-height: 600px;
  background: white;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    min-height: 90vh;
    width: 95%;
    margin: 1rem;
  }
`;

const Sidebar = styled.div`
  width: 300px;
  background: linear-gradient(180deg, #6366f1 0%, #4f46e5 100%);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%237b74ec' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 1.5rem;
    min-height: auto;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2.5rem;
  overflow-y: auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const MobileCloseButton = styled.button`
  display: none;
  width: 100%;
  padding: 1rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #4f46e5;
  }

  /* Show only on mobile */
  @media (max-width: 768px) {
    display: flex;
  }
`;

const Title = styled.h2`
  color: white;
  font-size: 2.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  white-space: nowrap;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  letter-spacing: -0.5px;

  svg {
    font-size: 1.75rem;
    animation: ${floatAnimation} 3s ease-in-out infinite;
  }
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-weight: 400;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  letter-spacing: -0.2px;
`;

interface StepProps {
  $isActive: boolean;
  $delay: number;
  $isNavigating: boolean;
}

const Step = styled.div<StepProps>`
  background: ${({ $isActive }) =>
    $isActive ? "rgba(255, 255, 255, 0.15)" : "transparent"};
  border-radius: 16px;
  padding: 1rem 1.25rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: ${({ $isActive, $isNavigating, $delay }) =>
    $isActive && $isNavigating
      ? css`
          ${pulseAnimation} 0.3s ease
        `
      : css`
          ${fadeIn} 0.5s ${$delay}s forwards
        `};
  opacity: 0;
  position: relative;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-weight: 500;
  letter-spacing: -0.2px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  ${({ $isActive }) =>
    $isActive &&
    css`
      background: rgba(255, 255, 255, 0.15);
    `}
`;

const StepNumber = styled.div`
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
`;

interface StepContentProps {
  $isActive: boolean;
  $isNavigating: boolean;
}

const StepContent = styled.div<StepContentProps>`
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  height: calc(100% - 3rem);
  display: flex;
  flex-direction: column;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  animation: ${({ $isNavigating }) =>
    $isNavigating
      ? css`
          ${slideIn} 0.3s ease-out
        `
      : "none"};

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    letter-spacing: -0.3px;

    svg {
      color: #6366f1;
      font-size: 1.25rem;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    li {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
      color: #4a5568;
      font-size: 1.2rem;
      line-height: 1.5;
      border-bottom: 1px solid #f0f0f0;
      font-weight: 400;
      letter-spacing: -0.2px;

      &:last-child {
        border-bottom: none;
      }

      svg {
        color: #6366f1;
        font-size: 0.875rem;
        flex-shrink: 0;
      }
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  color: #1a1a1a;
  cursor: pointer;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: rotate(90deg);
  }

  svg {
    font-size: 1.25rem;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    min-width: 44px;
    min-height: 44px;

    &:hover {
      background: rgba(0, 0, 0, 0.15);
    }

    svg {
      font-size: 1.5rem;
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
  const [activeStep, setActiveStep] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);

  if (!isOpen) return null;

  const steps = [
    {
      id: 1,
      title: "Overview",
      icon: FaBriefcase,
      content: [
        "Track all your job applications in one place",
        "Monitor application status and progress",
        "Stay organized throughout your job search",
        "Keep all important information accessible",
      ],
    },
    {
      id: 2,
      title: "Managing Applications",
      icon: FaFileAlt,
      content: [
        "Create new job application entries easily",
        "Upload and manage multiple resume versions",
        "Add detailed notes and important dates",
        "Track communication history",
      ],
    },
    {
      id: 3,
      title: "Filtering & Organization",
      icon: FaFilter,
      content: [
        "Search for specific companies or positions",
        "Filter applications by status or date",
        "Sort and organize your applications",
        "Get insights into your job search",
      ],
    },
    {
      id: 4,
      title: "Managing Details",
      icon: FaEdit,
      content: [
        "Edit application details anytime",
        "Update status as you progress",
        "Set reminders for follow-ups",
        "Track interview schedules",
      ],
    },
  ];

  const handleStepClick = (stepId: number) => {
    setIsNavigating(true);
    setActiveStep(stepId);
    setTimeout(() => setIsNavigating(false), 150);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <Sidebar>
          <Title>
            <FaLightbulb />
            How To Use
          </Title>
          <Description>
            Learn how to make the most of TrackIt and streamline your job
            application process.
          </Description>

          {steps.map((step, index) => (
            <Step
              key={step.id}
              $isActive={activeStep === step.id}
              $isNavigating={isNavigating}
              onClick={() => handleStepClick(step.id)}
              $delay={0.2 + index * 0.1}
            >
              <StepNumber>{step.id}</StepNumber>
              {step.title}
            </Step>
          ))}
        </Sidebar>

        <MainContent>
          {steps.map(
            (step) =>
              activeStep === step.id && (
                <StepContent
                  key={step.id}
                  $isActive={true}
                  $isNavigating={isNavigating}
                >
                  <h3>
                    <step.icon />
                    {step.title}
                  </h3>
                  <ul>
                    {step.content.map((item, index) => (
                      <li key={index}>
                        <FaChevronRight />
                        {item}
                      </li>
                    ))}
                  </ul>
                </StepContent>
              )
          )}

          {/* Mobile Close Button */}
          <MobileCloseButton onClick={onClose}>
            <FaTimes />
            Close
          </MobileCloseButton>
        </MainContent>
      </ModalContent>
    </ModalOverlay>
  );
};
