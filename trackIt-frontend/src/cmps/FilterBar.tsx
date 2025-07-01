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
`;

const FilterChipsContainer = styled.div`
  /* Layout */
  display: flex;
  gap: 0.75rem;
  flex: 1;

  /* Responsive Behavior */
  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    scroll-behavior: smooth;

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
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #000000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  
  /* Interactive */
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
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

  /* Active State */
  ${({ $active }) =>
    $active &&
    `
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
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
  border-color: rgba(255, 255, 255, 0.12);
  padding-right: 1.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const Dropdown = styled.div`
  /* Positioning */
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;

  /* Styling */
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 0.75rem 0.5rem;
  min-width: 220px;

  /* Shadow and Stacking */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 1050;

  /* Animation */
  opacity: 0;
  transform: translateY(-8px);
  transition: all 0.2s ease;
  pointer-events: none;
  visibility: hidden;

  &.show {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
    visibility: visible;
  }
`;

const SearchInput = styled.input`
  /* Layout */
  width: 100%;
  height: 40px;
  padding: 0 1rem;
  margin-bottom: 0.5rem;

  /* Styling */
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;

  /* Placeholder */
  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }

  /* Focus State */
  &:focus {
    outline: none;
    border-color: rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.05);
  }
`;

const DropdownItem = styled.div<{ $active?: boolean }>`
  /* Layout */
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin: 0.25rem 0;

  /* Typography */
  font-size: 0.9375rem;
  color: ${({ $active }) =>
    $active ? "rgba(0, 0, 0, 0.9)" : "rgba(0, 0, 0, 0.7)"};

  /* Interactive */
  cursor: pointer;
  transition: all 0.15s ease;

  /* States */
  background: ${({ $active }) =>
    $active ? "rgba(0, 0, 0, 0.05)" : "transparent"};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.9);
  }
`;

const ActiveFiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
  flex: 1;
`;

const ActiveFilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);

  svg {
    font-size: 0.75rem;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }
`;

const FilterLabel = styled.span`
  color: rgba(255, 255, 255, 0.8);
  margin-right: 0.25rem;
`;

interface FilterBarProps {
  filters: {
    company: string;
    position: string;
    status: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onResetFilters: () => void;
}

export const FilterBar = ({
  filters,
  onFilterChange,
  onResetFilters,
}: FilterBarProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleDropdownToggle = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    if (dropdownName === "company") {
      setSearchText(filters.company || "");
    }
  };

  const handleFilterSelect = (filterType: string, value: string) => {
    onFilterChange(filterType, value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    setIsTyping(true);
    handleFilterSelect("company", value);
  };

  const handleSearchFocus = () => {
    setIsTyping(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const isClickInDropdown = target.closest(".filter-dropdown");
    const isClickInFilterChip = target.closest(".filter-chip");
    const isClickInSearchInput = target === searchInputRef.current;

    if (!isClickInDropdown && !isClickInFilterChip && !isClickInSearchInput) {
      setActiveDropdown(null);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRemoveFilter = (filterType: string) => {
    onFilterChange(filterType, "");
  };

  const statusOptions = Object.values(JobStatus);

  return (
    <FilterBarContainer>
      <FilterChipsContainer>
        <FilterChip
          className="filter-chip"
          $active={activeDropdown === "company"}
          onClick={() => handleDropdownToggle("company")}
        >
          <FaBuilding />
          Company
          <FaChevronDown className="chevron" />
        </FilterChip>
        <FilterChip
          className="filter-chip"
          onClick={() => handleDropdownToggle("position")}
          $active={activeDropdown === "position"}
        >
          <FaBriefcase />
          Position
          <FaChevronDown className="chevron" />
        </FilterChip>
        <FilterChip
          className="filter-chip"
          onClick={() => handleDropdownToggle("status")}
          $active={activeDropdown === "status"}
        >
          <FaChartLine />
          Status
          <FaChevronDown className="chevron" />
        </FilterChip>
      </FilterChipsContainer>

      <ActiveFiltersContainer>
        {filters.company && (
          <ActiveFilterTag>
            <FilterLabel>Company:</FilterLabel>
            {filters.company}
            <FaTimes onClick={() => handleRemoveFilter("company")} />
          </ActiveFilterTag>
        )}
        {filters.position && (
          <ActiveFilterTag>
            <FilterLabel>Position:</FilterLabel>
            {filters.position}
            <FaTimes onClick={() => handleRemoveFilter("position")} />
          </ActiveFilterTag>
        )}
        {filters.status && (
          <ActiveFilterTag>
            <FilterLabel>Status:</FilterLabel>
            {filters.status}
            <FaTimes onClick={() => handleRemoveFilter("status")} />
          </ActiveFilterTag>
        )}
      </ActiveFiltersContainer>

      <ResetAllButton onClick={onResetFilters}>
        <FaUndo />
        Reset All
      </ResetAllButton>

      {/* Dropdowns */}
      {activeDropdown === "company" && (
        <Dropdown className="filter-dropdown show">
          <SearchInput
            ref={searchInputRef}
            type="text"
            placeholder="Search companies..."
            value={searchText}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            autoFocus
          />
        </Dropdown>
      )}

      {activeDropdown === "position" && (
        <Dropdown className="filter-dropdown show">
          <SearchInput
            type="text"
            placeholder="Search positions..."
            value={filters.position}
            onChange={(e) => handleFilterSelect("position", e.target.value)}
            autoFocus
          />
        </Dropdown>
      )}

      {activeDropdown === "status" && (
        <Dropdown className="filter-dropdown show">
          {statusOptions.map((status) => (
            <DropdownItem
              key={status}
              $active={filters.status === status}
              onClick={() => handleFilterSelect("status", status)}
            >
              {status}
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </FilterBarContainer>
  );
};
