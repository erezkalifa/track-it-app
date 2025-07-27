import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { JobCard } from "../cmps/JobCard";
import { FilterBar, MobileFilterButton } from "../cmps/FilterBar";
import { FaFilter } from "react-icons/fa";
import { type Job, JobStatus } from "../types/types";
import { useNavigate, useLocation } from "react-router-dom";
import { useJobs } from "../context/JobContext";

const PageContainer = styled.div`
  /* Remove padding since MainLayout already provides it */
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  /* Left-align on larger widescreens */
  @media (min-width: 1200px) {
    text-align: left;
  }
`;

const PersonalGreeting = styled.h3`
  color: #4f46e5;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 8px;
  margin-top: 0;

  /* Mobile responsive */
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const MotivationalHeadline = styled.h1`
  color: #1f2937;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 12px;
  margin-top: 0;

  /* Mobile responsive */
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const KPIChipsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;

  /* Mobile responsive */
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const KPIChip = styled.div`
  background: #e5e7eb;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 8px;
  white-space: nowrap;
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 2rem;
  align-items: start;
  padding: 0 16px;

  /* Tablet styles */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 16px;
    position: relative;
  }
`;

const ScrollProgressIndicator = styled.div<{ $progress: number }>`
  position: fixed;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  z-index: 1000;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${({ $progress }) => $progress}%;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    transition: height 0.1s ease;
  }

  /* Only show on mobile */
  @media (min-width: 769px) {
    display: none;
  }
`;

const ScrollDownArrow = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: all 0.3s ease;
  pointer-events: ${({ $isVisible }) => ($isVisible ? "auto" : "none")};

  /* Arrow icon */
  &::after {
    content: "↓";
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    animation: ${({ $isVisible }) =>
      $isVisible ? "bounce 2s infinite" : "none"};
  }

  /* Bounce animation */
  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-3px);
    }
    60% {
      transform: translateY(-1px);
    }
  }

  /* Hover effect */
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-50%) scale(1.1);
  }

  /* Only show on mobile */
  @media (min-width: 769px) {
    display: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin: 2rem 0;
`;

const AddJobButton = styled.button`
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 2rem;
  gap: 0.75rem;

  /* Typography */
  font-size: 0.9375rem;
  font-weight: 500;

  /* Styling */
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  color: white;

  /* Glassmorphism */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  /* Shadow & Effects */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  margin-top: 2rem;

  /* Animation */
  transition: all 0.2s ease;

  /* Hover State */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    opacity: 0.95;
  }

  /* Icon Styling */
  i {
    font-size: 1rem;
  }
`;

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

export const JobListPage = () => {
  const { jobs, loading: isLoading } = useJobs();
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    company: "",
    position: "",
    status: "",
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [newJobId, setNewJobId] = useState<number | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Calculate KPI summary
  const kpiStats = {
    active: jobs.filter(
      (job) =>
        job.status === JobStatus.APPLIED || job.status === JobStatus.PENDING
    ).length,
    interviewing: jobs.filter((job) => job.status === JobStatus.INTERVIEWING)
      .length,
    offers: jobs.filter((job) => job.status === JobStatus.ACCEPTED).length,
  };

  // Apply filters whenever filters state changes
  useEffect(() => {
    let result = [...jobs];

    if (filters.company) {
      result = result.filter((job) =>
        job.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    if (filters.position) {
      result = result.filter((job) =>
        job.position.toLowerCase().includes(filters.position.toLowerCase())
      );
    }

    if (filters.status) {
      result = result.filter(
        (job) => job.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    setFilteredJobs(result);
  }, [filters, jobs]);

  useEffect(() => {
    // Check if we have a new job ID in the location state
    if (location.state?.newJobId) {
      setNewJobId(location.state.newJobId);
      // Clear the highlight effect after animation
      setTimeout(() => {
        setNewJobId(null);
      }, 1500);
    }
  }, [location]);

  // Add window scroll listener for mobile
  useEffect(() => {
    const handleWindowScroll = () => {
      handleScroll();
    };

    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFilterOpen]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ company: "", position: "", status: "" });
  };

  const handleAddJob = () => {
    navigate("/jobs/new");
  };

  const handleMobileFilterOpen = () => {
    setIsMobileFilterOpen(true);
  };

  const handleMobileFilterClose = () => {
    setIsMobileFilterOpen(false);
  };

  const handleScrollDown = () => {
    window.scrollBy({
      top: 300,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(Math.min(100, Math.max(0, progress)));

    // Hide arrow when near bottom
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    setShowScrollArrow(!isNearBottom);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div>Loading jobs...</div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div>{error}</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PersonalGreeting>Welcome back, Erez 👋</PersonalGreeting>
        <MotivationalHeadline>Your Job Applications</MotivationalHeadline>
        <KPIChipsContainer>
          <KPIChip>{kpiStats.active} Active</KPIChip>
          <KPIChip>{kpiStats.interviewing} Interviewing</KPIChip>
          <KPIChip>{kpiStats.offers} Offers</KPIChip>
        </KPIChipsContainer>
      </PageHeader>

      <FilterBarContainer>
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />
      </FilterBarContainer>

      {/* Mobile Filter Button - always visible, positioned above content */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "1rem",
          paddingLeft: "0.5rem", // Small shift to the right
        }}
      >
        <MobileFilterButton onClick={handleMobileFilterOpen}>
          <FaFilter />
          Filter
        </MobileFilterButton>
      </div>

      {filteredJobs.length > 0 ? (
        <>
          <JobsGrid>
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} isNew={job.id === newJobId} />
            ))}
          </JobsGrid>
          <ScrollProgressIndicator $progress={scrollProgress} />
          <ScrollDownArrow
            $isVisible={showScrollArrow}
            onClick={handleScrollDown}
          />
        </>
      ) : (
        <EmptyState>
          <i
            className="fas fa-briefcase fa-3x"
            style={{ marginBottom: "1rem", opacity: 0.5 }}
          />
          <h3>No Job Applications Found</h3>
          <p>
            {jobs.length === 0
              ? "Start by adding your first job application"
              : "No jobs match your current filters"}
          </p>
          <AddJobButton onClick={handleAddJob}>
            <i className="fas fa-plus-circle" />
            Add New Job
          </AddJobButton>
        </EmptyState>
      )}

      {filteredJobs.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <AddJobButton onClick={handleAddJob}>
            <i className="fas fa-plus" />
            Add New Job
          </AddJobButton>
        </div>
      )}

      {/* Mobile Filter Modal */}
    </PageContainer>
  );
};
