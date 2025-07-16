import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { JobCard } from "../cmps/JobCard";
import { FilterBar } from "../cmps/FilterBar";
import { type Job, JobStatus } from "../types/types";
import { useNavigate, useLocation } from "react-router-dom";
import { useJobs } from "../context/JobContext";

const PageContainer = styled.div`
  padding: 2rem;

  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h2`
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  align-items: start;

  /* Mobile styles */
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
    padding: 0.5rem 0;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;

    /* Hide scrollbar but keep functionality */
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
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

export const JobListPage = () => {
  const { jobs, loading: isLoading } = useJobs();
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    company: "",
    position: "",
    status: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [newJobId, setNewJobId] = useState<number | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ company: "", position: "", status: "" });
  };

  const handleAddJob = () => {
    navigate("/jobs/new");
  };

  const handleMobileFilterClose = () => {
    setIsMobileFilterOpen(false);
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
        <PageTitle>Job Applications</PageTitle>
        <PageSubtitle>Track and manage your job search journey</PageSubtitle>
      </PageHeader>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        isMobileModalOpen={isMobileFilterOpen}
        onMobileModalClose={handleMobileFilterClose}
      />

      {filteredJobs.length > 0 ? (
        <JobsGrid>
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} isNew={job.id === newJobId} />
          ))}
        </JobsGrid>
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
    </PageContainer>
  );
};
