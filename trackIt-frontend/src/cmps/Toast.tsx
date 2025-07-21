import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

export type ToastType = "success" | "error" | "info";

type ToastMessage = string | { msg: string } | { detail: string } | unknown;

interface ToastProps {
  type: ToastType;
  message: ToastMessage;
  onClose: () => void;
  duration?: number;
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case "success":
      return <FaCheckCircle />;
    case "error":
      return <FaExclamationCircle />;
    case "info":
      return <FaInfoCircle />;
    default:
      return null;
  }
};

const getMessageText = (message: ToastMessage): string => {
  if (typeof message === "string") {
    return message;
  }
  if (message && typeof message === "object") {
    if ("msg" in message) {
      return message.msg as string;
    }
    if ("detail" in message) {
      return message.detail as string;
    }
  }
  return "An error occurred";
};

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const ToastContainer = styled.div<{ type: ToastType }>`
  position: fixed;
  top: 5rem;
  right: 1rem;
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  background: ${({ type }) => {
    switch (type) {
      case "success":
        return "linear-gradient(135deg, #22c55e 0%, #22c55edd 100%)";
      case "error":
        return "linear-gradient(135deg, #ef4444 0%, #ef4444dd 100%)";
      case "info":
        return "linear-gradient(135deg, #3b82f6 0%, #3b82f6dd 100%)";
      default:
        return "linear-gradient(135deg, #6366f1 0%, #6366f1dd 100%)";
    }
  }};
  color: white;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1200;
  animation: ${slideIn} 0.3s ease-out;
  min-width: 300px;
  max-width: 400px;
`;

const IconWrapper = styled.div`
  margin-right: 0.75rem;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  opacity: 0.9;
`;

const Message = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  flex-grow: 1;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  opacity: 0.8;
  transition: all 0.2s ease;
  min-width: 24px;
  min-height: 24px;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  console.log("Toast rendered with type:", type, "message:", message);

  return (
    <ToastContainer type={type}>
      <IconWrapper>{getToastIcon(type)}</IconWrapper>
      <Message>{getMessageText(message)}</Message>
      <CloseButton onClick={onClose} aria-label="Close notification">
        <IoMdClose />
      </CloseButton>
    </ToastContainer>
  );
};

export default Toast;
