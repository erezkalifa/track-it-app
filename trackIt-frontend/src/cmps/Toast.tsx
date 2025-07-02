import React, { useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
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
  border-radius: 8px;
  background: ${({ theme, type }) => {
    switch (type) {
      case "success":
        return theme.colors.success || "#4CAF50";
      case "error":
        return theme.colors.error || "#f44336";
      case "info":
        return theme.colors.info || "#2196F3";
      default:
        return theme.colors.primary;
    }
  }};
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
`;

const Message = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  flex-grow: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  margin-left: 0.75rem;
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
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
