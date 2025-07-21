import React from "react";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { JobStatus } from "../types/types";
import type { DefaultTheme } from "styled-components";
import {
  FaBuilding,
  FaBriefcase,
  FaChartLine,
  FaChevronDown,
  FaUndo,
  FaTimes,
  FaSearch,
  FaFilter,
  FaChevronUp,
} from "react-icons/fa";

const FilterBarContainer = styled.div`
  /* Container Structure */
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 1rem;
  position: relative;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;

  /* Mobile styles */
  @media (max-width: 768px) {
    display: none; /* Hide desktop filter bar on mobile */
  }
`;

// Mobile Floating Filter Button
const MobileFilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  svg {
    font-size: 0.875rem;
    opacity: 0.8;
  }

  /* Hide on desktop */
  @media (min-width: 769px) {
    display: none;
  }
`;

// Mobile Filter Modal
const MobileFilterModal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
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

const MobileFilterSheet = styled.div<{ $isOpen: boolean }>`
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  max-height: 70vh;
  transform: scale(${({ $isOpen }) => ($isOpen ? "1" : "0.9")})
    translateY(${({ $isOpen }) => ($isOpen ? "0" : "20px")});
  transition: all 0.3s ease;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const MobileFilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-top: 1rem;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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

const MobileFilterSection = styled.div`
  margin-bottom: 1.5rem;

  h4 {
    font-size: 1rem;
    font-weight: 500;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    margin: 0 0 0.75rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  svg {
    font-size: 0.875rem;
    color: #666;
  }
`;

const MobileSearchInput = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}15;
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const MobileStatusOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MobileStatusSelect = styled.div`
  position: relative;
  width: 100%;
`;

const MobileStatusSelectButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  svg {
    font-size: 1rem;
    transition: transform 0.2s ease;
    transform: rotate(${({ $isOpen }) => ($isOpen ? "180deg" : "0deg")});
  }
`;

const MobileStatusDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transform: translateY(${({ $isOpen }) => ($isOpen ? "0" : "-10px")});
  transition: all 0.2s ease;
  max-height: 200px;
  overflow-y: auto;
`;

const MobileStatusDropdownOption = styled.button<{ $isSelected: boolean }>`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: ${({ $isSelected }) =>
    $isSelected ? "rgba(99, 102, 241, 0.1)" : "transparent"};
  color: ${({ $isSelected }) => ($isSelected ? "#6366f1" : "#333")};
  font-size: 1rem;
  font-weight: ${({ $isSelected }) => ($isSelected ? "500" : "400")};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${({ $isSelected }) =>
      $isSelected ? "rgba(99, 102, 241, 0.15)" : "rgba(0, 0, 0, 0.05)"};
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
  }
`;

const MobileStatusOption = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem;
  border: 1px solid
    ${({ $active }) => ($active ? "#6366f1" : "rgba(255, 255, 255, 0.3)")};
  border-radius: 12px;
  background: ${({ $active }) =>
    $active ? "rgba(99, 102, 241, 0.3)" : "rgba(255, 255, 255, 0.2)"};
  color: ${({ $active }) => ($active ? "#fff" : "#fff")};
  font-size: 1rem;
  font-weight: ${({ $active }) => ($active ? "500" : "400")};
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

  &:hover {
    background: ${({ $active }) =>
      $active ? "rgba(99, 102, 241, 0.4)" : "rgba(255, 255, 255, 0.3)"};
  }

  svg {
    font-size: 1rem;
    opacity: ${({ $active }) => ($active ? "1" : "0")};
  }
`;

const MobileActiveFilters = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  h4 {
    font-size: 1rem;
    font-weight: 500;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    margin: 0 0 1rem 0;
  }
`;

const MobileActiveFilterChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  margin: 0.25rem;
  font-size: 0.875rem;
  color: #6366f1;

  button {
    background: none;
    border: none;
    color: #6366f1;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;

    svg {
      font-size: 0.75rem;
    }

    &:hover {
      opacity: 0.7;
    }
  }
`;

const MobileFilterActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const MobileResetLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;

  &:hover {
    color: rgba(255, 255, 255, 1);
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    font-size: 0.75rem;
  }
`;

const MobileActionButton = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 0.875rem;
  border: 1px solid
    ${({ $primary }) => ($primary ? "transparent" : "rgba(255, 255, 255, 0.3)")};
  border-radius: 12px;
  background: ${({ $primary }) =>
    $primary ? "rgba(99, 102, 241, 0.8)" : "rgba(255, 255, 255, 0.2)"};
  color: ${({ $primary }) => ($primary ? "white" : "white")};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

  &:hover {
    background: ${({ $primary }) =>
      $primary ? "rgba(99, 102, 241, 0.9)" : "rgba(255, 255, 255, 0.3)"};
  }
`;

const FilterChipsContainer = styled.div`
  /* Layout */
  display: flex;
  gap: 0.75rem;

  /* Responsive Behavior */
  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    scroll-behavior: smooth;
    width: 100%;
    justify-content: flex-start;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const ResetAllButton = styled.button`
  /* Layout */
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;

  /* Typography */
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;

  /* Styling */
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;

  /* Interactive */
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    opacity: 0.95;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  /* Icon Styling */
  svg {
    font-size: 1rem;
  }
`;

const buttonBaseStyles = `
  /* Layout */
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  
  /* Typography */
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  
  /* Styling */
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.12);
  border: none;
  color: #000000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  
  /* Interactive */
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.18);
    transform: translateY(-1px);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  /* Icon Styling */
  svg {
    font-size: 1rem;
    opacity: 0.8;
  }
`;

const FilterChip = styled.button<{ $active?: boolean }>`
  ${buttonBaseStyles}
  position: relative;

  /* Active State */
  ${({ $active }) =>
    $active &&
    `
    background: rgba(255, 255, 255, 0.2);
    color: #000000;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;

    svg {
      opacity: 1;
    }
  `}

  /* Chevron Icon */
  .chevron {
    margin-left: 0.25rem;
    font-size: 0.875rem;
    transition: transform 0.2s ease;
  }

  ${({ $active }) =>
    $active &&
    `
    .chevron {
      transform: rotate(180deg);
    }
  `}
`;

const ResetButton = styled.button`
  ${buttonBaseStyles}

  /* Specific Reset Button Styling */
  background: rgba(255, 255, 255, 0.1);
  padding-right: 1.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SearchButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-75%);
  height: 20px;
  width: 20px;
  opacity: 0.6;

  svg {
    font-size: 0.875rem;
  }

  &:hover {
    opacity: 1;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Dropdown = styled.div<{ $xPos?: number }>`
  /* Positioning */
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  transform: none;

  /* Styling */
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 0.75rem;
  min-width: 240px;

  /* Shadow and Stacking */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  z-index: 1050;

  /* Animation */
  opacity: 0;
  transform: translateY(-8px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;

  /* Active State */
  &.active {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  /* Search Input Styling */
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    background: rgba(255, 255, 255, 0.9);
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}15;
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.4);
    }
  }

  /* Options Container */
  .options {
    max-height: 280px;
    overflow-y: auto;
    margin: 0 -0.75rem;
    padding: 0.25rem 0.75rem;

    /* Scrollbar Styling */
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.15);
      border: 2px solid transparent;
      background-clip: padding-box;
    }
  }
`;

const DropdownItem = styled.div<{ $active?: boolean }>`
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  margin: 0.25rem 0;

  /* Styling */
  border-radius: 12px;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : "rgba(0, 0, 0, 0.8)"};
  background: ${({ $active }) =>
    $active ? "rgba(99, 102, 241, 0.08)" : "transparent"};
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? "500" : "400")};

  /* Interactive */
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;

  /* Hover State */
  &:hover {
    background: ${({ $active }) =>
      $active ? "rgba(99, 102, 241, 0.12)" : "rgba(0, 0, 0, 0.04)"};
  }

  /* Active State */
  &:active {
    transform: scale(0.98);
  }

  /* Check Icon */
  svg {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.primary};
    opacity: ${({ $active }) => ($active ? "1" : "0")};
    transition: all 0.2s ease;
  }
`;

const ActiveFiltersContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  flex: 1;
  flex-wrap: wrap;

  /* Mobile styles */
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    gap: 0.5rem;
  }
`;

const ActiveFilterTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  background: none;

  svg {
    font-size: 0.75rem;
    opacity: 0.8;
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${({ theme }) => theme.colors.textLight};

    &:hover {
      opacity: 1;
      color: ${({ theme }) => theme.colors.error};
    }
  }
`;

const FilterLabel = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.8125rem;
`;

const SelectedFilterValue = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};

  span {
    font-weight: 500;
  }
`;

interface FilterBarProps {
  filters: {
    company: string;
    position: string;
    status: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onResetFilters: () => void;
  isMobileModalOpen?: boolean;
  onMobileModalClose?: () => void;
}

export const FilterBar = ({
  filters,
  onFilterChange,
  onResetFilters,
  isMobileModalOpen = false,
  onMobileModalClose,
}: FilterBarProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchTerms, setMobileSearchTerms] = useState({
    company: "",
    position: "",
  });
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const statusOptions = [
    { value: JobStatus.APPLIED, label: "Applied" },
    { value: JobStatus.INTERVIEWING, label: "Interviewing" },
    { value: JobStatus.REJECTED, label: "Rejected" },
    { value: JobStatus.ACCEPTED, label: "Accepted" },
    { value: JobStatus.PENDING, label: "Pending" },
  ];

  const handleDropdownToggle = (
    dropdownName: "company" | "position" | "status"
  ) => {
    const chipElement = containerRef.current?.querySelector(
      `[data-filter="${dropdownName}"]`
    );
    if (chipElement) {
      setSearchTerm(filters[dropdownName] || "");
    }
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleFilterSelect = (
    filterType: "company" | "position" | "status",
    value: string
  ) => {
    onFilterChange(filterType, value);
    setActiveDropdown(null);
    setSearchTerm("");
  };

  const handleSearch = (filterType: "company" | "position" | "status") => {
    if (searchTerm.trim()) {
      handleFilterSelect(filterType, searchTerm.trim());
    }
  };

  // Real-time filtering with debouncing - apply filter as user types
  const handleRealTimeFilter = (
    filterType: "company" | "position" | "status",
    value: string
  ) => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for debounced filtering
    debounceTimeoutRef.current = setTimeout(() => {
      onFilterChange(filterType, value);
    }, 300); // 300ms delay
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Close desktop dropdown
      if (containerRef.current && !containerRef.current.contains(target)) {
        setActiveDropdown(null);
        setSearchTerm("");
      }
      // Close mobile status dropdown
      if (
        isStatusDropdownOpen &&
        statusDropdownRef.current &&
        statusButtonRef.current &&
        !statusDropdownRef.current.contains(target) &&
        !statusButtonRef.current.contains(target)
      ) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStatusDropdownOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handle Enter key to close dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setActiveDropdown(null);
      setSearchTerm("");
    }
  };

  // Handle Enter key to close mobile modal
  const handleMobileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (onMobileModalClose) {
        onMobileModalClose();
      }
    }
  };

  // Mobile filter handlers
  const handleMobileFilterOpen = () => {
    if (onMobileModalClose) {
      setMobileSearchTerms({
        company: filters.company || "",
        position: filters.position || "",
      });
    }
  };

  const handleMobileFilterClose = () => {
    if (onMobileModalClose) {
      onMobileModalClose();
    }
  };

  const handleMobileSearchChange = (
    type: "company" | "position",
    value: string
  ) => {
    setMobileSearchTerms((prev) => ({ ...prev, [type]: value }));

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for debounced filtering
    debounceTimeoutRef.current = setTimeout(() => {
      onFilterChange(type, value);
    }, 300);
  };

  const handleMobileStatusSelect = (status: string) => {
    // If clicking the same status, clear it (deselect)
    if (filters.status === status) {
      onFilterChange("status", "");
    } else {
      onFilterChange("status", status);
    }
    setIsStatusDropdownOpen(false);
  };

  const handleMobileStatusToggle = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  const handleMobileFilterRemove = (
    type: "company" | "position" | "status"
  ) => {
    onFilterChange(type, "");
    if (type === "company" || type === "position") {
      setMobileSearchTerms((prev) => ({ ...prev, [type]: "" }));
    }
  };

  const handleMobileResetAll = () => {
    onResetFilters();
    setMobileSearchTerms({ company: "", position: "" });
  };

  return (
    <>
      {/* Desktop Filter Bar */}
      <FilterBarContainer ref={containerRef}>
        <FilterChipsContainer>
          {/* Company Filter */}
          <div style={{ position: "relative" }}>
            <FilterChip
              data-filter="company"
              $active={activeDropdown === "company"}
              onClick={() => handleDropdownToggle("company")}
            >
              <FaBuilding />
              Company
              <FaChevronDown className="chevron" />
            </FilterChip>
            {activeDropdown === "company" && (
              <Dropdown className="active">
                <SearchInputWrapper>
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchTerm(value);
                      handleRealTimeFilter("company", value);
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  <SearchButton onClick={() => handleSearch("company")}>
                    <FaSearch />
                  </SearchButton>
                </SearchInputWrapper>
                <div className="options">
                  {/* Company options will be filtered based on search */}
                </div>
              </Dropdown>
            )}
          </div>

          {/* Position Filter */}
          <div style={{ position: "relative" }}>
            <FilterChip
              data-filter="position"
              $active={activeDropdown === "position"}
              onClick={() => handleDropdownToggle("position")}
            >
              <FaBriefcase />
              Position
              <FaChevronDown className="chevron" />
            </FilterChip>
            {activeDropdown === "position" && (
              <Dropdown className="active">
                <SearchInputWrapper>
                  <input
                    type="text"
                    placeholder="Search positions..."
                    value={searchTerm}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchTerm(value);
                      handleRealTimeFilter("position", value);
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  <SearchButton onClick={() => handleSearch("position")}>
                    <FaSearch />
                  </SearchButton>
                </SearchInputWrapper>
                <div className="options">
                  {/* Position options will be filtered based on search */}
                </div>
              </Dropdown>
            )}
          </div>

          {/* Status Filter */}
          <div style={{ position: "relative" }}>
            <FilterChip
              data-filter="status"
              $active={activeDropdown === "status"}
              onClick={() => handleDropdownToggle("status")}
            >
              <FaChartLine />
              Status
              <FaChevronDown className="chevron" />
            </FilterChip>
            {activeDropdown === "status" && (
              <Dropdown className="active">
                <div className="options">
                  {statusOptions.map((status) => (
                    <DropdownItem
                      key={status.value}
                      onClick={() => handleFilterSelect("status", status.value)}
                    >
                      {status.label}
                    </DropdownItem>
                  ))}
                </div>
              </Dropdown>
            )}
          </div>
        </FilterChipsContainer>

        <ActiveFiltersContainer>
          {filters.company && (
            <ActiveFilterTag>
              <FilterLabel>Company:</FilterLabel>
              <SelectedFilterValue>
                <span>{filters.company}</span>
                <FaTimes onClick={() => handleFilterSelect("company", "")} />
              </SelectedFilterValue>
            </ActiveFilterTag>
          )}
          {filters.position && (
            <ActiveFilterTag>
              <FilterLabel>Position:</FilterLabel>
              <SelectedFilterValue>
                <span>{filters.position}</span>
                <FaTimes onClick={() => handleFilterSelect("position", "")} />
              </SelectedFilterValue>
            </ActiveFilterTag>
          )}
          {filters.status && (
            <ActiveFilterTag>
              <FilterLabel>Status:</FilterLabel>
              <SelectedFilterValue>
                <span>{filters.status}</span>
                <FaTimes onClick={() => handleFilterSelect("status", "")} />
              </SelectedFilterValue>
            </ActiveFilterTag>
          )}
        </ActiveFiltersContainer>

        {(filters.company || filters.position || filters.status) && (
          <ResetAllButton onClick={onResetFilters}>
            <FaUndo />
            Reset All
          </ResetAllButton>
        )}
      </FilterBarContainer>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        $isOpen={isMobileModalOpen}
        onClick={handleMobileFilterClose}
      >
        <MobileFilterSheet
          $isOpen={isMobileModalOpen}
          onClick={(e) => e.stopPropagation()}
        >
          <MobileFilterHeader>
            <h3>Filters</h3>
            <button onClick={handleMobileFilterClose}>
              <FaTimes />
            </button>
          </MobileFilterHeader>

          {/* Active Filters - moved to top */}
          {(filters.company || filters.position || filters.status) && (
            <MobileActiveFilters>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <h4>Active Filters</h4>
                <MobileResetLink onClick={handleMobileResetAll}>
                  <FaUndo />
                  Reset All
                </MobileResetLink>
              </div>
              <div>
                {filters.company && (
                  <MobileActiveFilterChip>
                    Company: {filters.company}
                    <button onClick={() => handleMobileFilterRemove("company")}>
                      <FaTimes />
                    </button>
                  </MobileActiveFilterChip>
                )}
                {filters.position && (
                  <MobileActiveFilterChip>
                    Position: {filters.position}
                    <button
                      onClick={() => handleMobileFilterRemove("position")}
                    >
                      <FaTimes />
                    </button>
                  </MobileActiveFilterChip>
                )}
                {filters.status && (
                  <MobileActiveFilterChip>
                    Status: {filters.status}
                    <button onClick={() => handleMobileFilterRemove("status")}>
                      <FaTimes />
                    </button>
                  </MobileActiveFilterChip>
                )}
              </div>
            </MobileActiveFilters>
          )}

          {/* Company Filter */}
          <MobileFilterSection>
            <h4>
              <FaBuilding />
              Company
            </h4>
            <MobileSearchInput
              type="text"
              placeholder="Search companies..."
              value={mobileSearchTerms.company}
              onChange={(e) =>
                handleMobileSearchChange("company", e.target.value)
              }
              onKeyDown={handleMobileKeyDown}
            />
          </MobileFilterSection>

          {/* Position Filter */}
          <MobileFilterSection>
            <h4>
              <FaBriefcase />
              Position
            </h4>
            <MobileSearchInput
              type="text"
              placeholder="Search positions..."
              value={mobileSearchTerms.position}
              onChange={(e) =>
                handleMobileSearchChange("position", e.target.value)
              }
              onKeyDown={handleMobileKeyDown}
            />
          </MobileFilterSection>

          {/* Status Filter */}
          <MobileFilterSection>
            <h4>
              <FaChartLine />
              Status
            </h4>
            <MobileStatusSelect>
              <MobileStatusSelectButton
                $isOpen={isStatusDropdownOpen}
                onClick={handleMobileStatusToggle}
                ref={statusButtonRef}
              >
                {filters.status || "Select status"}
                <FaChevronDown />
              </MobileStatusSelectButton>
              <MobileStatusDropdown
                $isOpen={isStatusDropdownOpen}
                ref={statusDropdownRef}
              >
                {statusOptions.map((status) => (
                  <MobileStatusDropdownOption
                    key={status.value}
                    $isSelected={filters.status === status.value}
                    onClick={() => handleMobileStatusSelect(status.value)}
                  >
                    {status.label}
                  </MobileStatusDropdownOption>
                ))}
              </MobileStatusDropdown>
            </MobileStatusSelect>
          </MobileFilterSection>

          {/* Action Buttons */}
          <MobileFilterActions>
            <MobileActionButton onClick={handleMobileFilterClose}>
              Close
            </MobileActionButton>
          </MobileFilterActions>
        </MobileFilterSheet>
      </MobileFilterModal>
    </>
  );
};

// Export the mobile filter button for use in other components
export { MobileFilterButton };
