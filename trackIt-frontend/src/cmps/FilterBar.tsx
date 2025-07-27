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

// Light harmonious filter bar
const FilterBarContainer = styled.div`
  /* Container Structure */
  display: flex;
  flex-direction: column;
  margin: 16px 0;
  position: relative;
  z-index: 1000;
  width: 100%;

  /* Mobile styles */
  @media (max-width: 768px) {
    display: none; /* Hide desktop filter bar on mobile */
  }
`;

const FilterBarWrapper = styled.div`
  /* Container styling */
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width: fit-content;
  max-width: 100%;
  margin: 0 16px;

  /* Responsive behavior */
  @media (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    scroll-behavior: smooth;
    margin: 0 16px;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const FilterBarLabel = styled.div`
  /* Label styling */
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 12px;
`;

const FilterPillsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 44px; /* Ensure minimum tap target size */

  /* Responsive behavior */
  @media (max-width: 768px) {
    padding: 0 16px;
    min-width: max-content;
  }
`;

// Mobile Floating Filter Button
const MobileFilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
  }
`;

const MobileFilterSheet = styled.div<{ $isOpen: boolean }>`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  max-height: 70vh;
  transform: scale(${({ $isOpen }) => ($isOpen ? "1" : "0.9")})
    translateY(${({ $isOpen }) => ($isOpen ? "0" : "20px")});
  transition: all 0.3s ease;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
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
    color: #1f2937;
    margin: 0;
  }

  button {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      background: #f3f4f6;
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
    color: #374151;
    margin: 0 0 0.75rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  svg {
    font-size: 0.875rem;
    color: #6b7280;
  }
`;

const MobileSearchInput = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: #ffffff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
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
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
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
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
    $isSelected ? "rgba(79, 70, 229, 0.1)" : "transparent"};
  color: ${({ $isSelected }) => ($isSelected ? "#4F46E5" : "#374151")};
  font-size: 1rem;
  font-weight: ${({ $isSelected }) => ($isSelected ? "500" : "400")};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${({ $isSelected }) =>
      $isSelected ? "rgba(79, 70, 229, 0.15)" : "#F9FAFB"};
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const MobileStatusOption = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem;
  border: 1px solid ${({ $active }) => ($active ? "#4F46E5" : "#E5E7EB")};
  border-radius: 8px;
  background: ${({ $active }) =>
    $active ? "rgba(79, 70, 229, 0.1)" : "#FFFFFF"};
  color: ${({ $active }) => ($active ? "#4F46E5" : "#374151")};
  font-size: 1rem;
  font-weight: ${({ $active }) => ($active ? "500" : "400")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? "rgba(79, 70, 229, 0.15)" : "#F9FAFB"};
  }

  svg {
    font-size: 1rem;
    opacity: ${({ $active }) => ($active ? "1" : "0")};
  }
`;

const MobileActiveFilters = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;

  h4 {
    font-size: 1rem;
    font-weight: 500;
    color: #374151;
    margin: 0 0 1rem 0;
  }
`;

const MobileActiveFilterChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 20px;
  margin: 0.25rem;
  font-size: 0.875rem;
  color: #4f46e5;

  button {
    background: none;
    border: none;
    color: #4f46e5;
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
  border-top: 1px solid #e5e7eb;
`;

const MobileResetLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;

  &:hover {
    color: #374151;
    background: #f3f4f6;
  }

  svg {
    font-size: 0.75rem;
  }
`;

const MobileActionButton = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 0.875rem;
  border: 1px solid ${({ $primary }) => ($primary ? "transparent" : "#E5E7EB")};
  border-radius: 8px;
  background: ${({ $primary }) => ($primary ? "#4F46E5" : "#FFFFFF")};
  color: ${({ $primary }) => ($primary ? "white" : "#374151")};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $primary }) => ($primary ? "#4338CA" : "#F9FAFB")};
  }
`;

const FilterChipsContainer = styled.div`
  /* Layout */
  display: flex;
  gap: 16px;

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
  padding: 8px 16px;

  /* Typography */
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;

  /* Styling */
  border-radius: 6px;
  background: #4f46e5;
  border: none;
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  /* Interactive */
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4338ca;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }

  /* Icon Styling */
  svg {
    font-size: 12px;
  }
`;

// Clean segmented-control pill styling
const FilterChip = styled.button<{ $active?: boolean }>`
  /* Layout */
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  min-height: 44px; /* Ensure minimum tap target size */

  /* Typography */
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;

  /* Styling */
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#4F46E5" : "#F3F4F6")};
  border: none;
  color: ${({ $active }) => ($active ? "#FFFFFF" : "#374151")};
  cursor: pointer;
  transition: all 0.2s ease;

  /* Icon Styling */
  svg {
    font-size: 14px;
    color: ${({ $active }) => ($active ? "#FFFFFF" : "#374151")};
  }

  /* Hover State - only when not active */
  &:hover {
    background: ${({ $active }) => ($active ? "#4338CA" : "#E5E7EB")};
    color: ${({ $active }) => ($active ? "#FFFFFF" : "#1F2937")};

    svg {
      color: ${({ $active }) => ($active ? "#FFFFFF" : "#1F2937")};
    }
  }

  /* Focus State */
  &:focus {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }

  /* Chevron Icon */
  .chevron {
    margin-left: 4px;
    font-size: 12px;
    transition: transform 0.2s ease;
    transform: ${({ $active }) =>
      $active ? "rotate(180deg)" : "rotate(0deg)"};
  }
`;

const SearchButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  transition: all 0.2s ease;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  height: 20px;
  width: 20px;
  opacity: 0.6;

  svg {
    font-size: 14px;
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
  top: calc(100% + 8px);
  left: 0;
  transform: none;

  /* Styling */
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  min-width: 240px;

  /* Shadow and Stacking */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 12px;
    font-size: 14px;
    background: #ffffff;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  /* Options Container */
  .options {
    max-height: 280px;
    overflow-y: auto;
    margin: 0 -12px;
    padding: 4px 12px;

    /* Scrollbar Styling */
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
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
  padding: 12px;
  margin: 2px 0;

  /* Styling */
  border-radius: 8px;
  color: ${({ $active }) => ($active ? "#4F46E5" : "#374151")};
  background: ${({ $active }) =>
    $active ? "rgba(79, 70, 229, 0.1)" : "transparent"};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? "500" : "400")};

  /* Interactive */
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;

  /* Hover State */
  &:hover {
    background: ${({ $active }) =>
      $active ? "rgba(79, 70, 229, 0.15)" : "#F9FAFB"};
  }

  /* Active State */
  &:active {
    transform: scale(0.98);
  }

  /* Check Icon */
  svg {
    font-size: 14px;
    color: #4f46e5;
    opacity: ${({ $active }) => ($active ? "1" : "0")};
    transition: all 0.2s ease;
  }
`;

const ActiveFiltersContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;

  /* Mobile styles */
  @media (max-width: 768px) {
    gap: 6px;
    margin-top: 12px;
    padding-top: 12px;
  }
`;

const ActiveFilterTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: #374151;
  background: none;

  svg {
    font-size: 12px;
    opacity: 0.8;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #6b7280;

    &:hover {
      opacity: 1;
      color: #ef4444;
    }
  }
`;

const FilterLabel = styled.span`
  color: #6b7280;
  font-size: 13px;
`;

const SelectedFilterValue = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;

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
        <FilterBarWrapper>
          <FilterBarLabel>Filters:</FilterBarLabel>
          <FilterPillsWrapper>
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
                        onClick={() =>
                          handleFilterSelect("status", status.value)
                        }
                      >
                        {status.label}
                      </DropdownItem>
                    ))}
                  </div>
                </Dropdown>
              )}
            </div>
          </FilterPillsWrapper>

          {(filters.company || filters.position || filters.status) && (
            <>
              <ActiveFiltersContainer>
                {filters.company && (
                  <ActiveFilterTag>
                    <FilterLabel>Company:</FilterLabel>
                    <SelectedFilterValue>
                      <span>{filters.company}</span>
                      <FaTimes
                        onClick={() => handleFilterSelect("company", "")}
                      />
                    </SelectedFilterValue>
                  </ActiveFilterTag>
                )}
                {filters.position && (
                  <ActiveFilterTag>
                    <FilterLabel>Position:</FilterLabel>
                    <SelectedFilterValue>
                      <span>{filters.position}</span>
                      <FaTimes
                        onClick={() => handleFilterSelect("position", "")}
                      />
                    </SelectedFilterValue>
                  </ActiveFilterTag>
                )}
                {filters.status && (
                  <ActiveFilterTag>
                    <FilterLabel>Status:</FilterLabel>
                    <SelectedFilterValue>
                      <span>{filters.status}</span>
                      <FaTimes
                        onClick={() => handleFilterSelect("status", "")}
                      />
                    </SelectedFilterValue>
                  </ActiveFilterTag>
                )}
              </ActiveFiltersContainer>

              <div style={{ marginTop: "12px" }}>
                <ResetAllButton onClick={onResetFilters}>
                  <FaUndo />
                  Reset All
                </ResetAllButton>
              </div>
            </>
          )}
        </FilterBarWrapper>
      </FilterBarContainer>

      {/* Mobile Filter Modal */}
      {isMobileModalOpen && (
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
                      <button
                        onClick={() => handleMobileFilterRemove("company")}
                      >
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
                      <button
                        onClick={() => handleMobileFilterRemove("status")}
                      >
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
      )}
    </>
  );
};

// Export the mobile filter button for use in other components
export { MobileFilterButton };
