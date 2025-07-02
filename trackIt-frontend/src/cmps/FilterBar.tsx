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
}

export const FilterBar = ({
  filters,
  onFilterChange,
  onResetFilters,
}: FilterBarProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    filterType: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const searchValue = (e.target as HTMLInputElement).value.trim();
      if (searchValue) {
        handleFilterSelect(
          filterType as "company" | "position" | "status",
          searchValue
        );
        setActiveDropdown(null);
        setSearchTerm("");
      }
    }
  };

  return (
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "company")}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "position")}
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
  );
};
