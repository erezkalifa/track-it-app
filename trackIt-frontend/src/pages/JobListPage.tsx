import { useState, useEffect } from "react";
import styled from "styled-components";
import { JobCard } from "../cmps/JobCard";
import { FilterBar } from "../cmps/FilterBar";
import { type Job, JobStatus } from "../types/types";
import { useNavigate } from "react-router-dom";

const PageContainer = styled.div`
  padding: 2rem;
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
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

// Mock data - replace with actual data from your API
const mockJobs: Job[] = [
  {
    id: "1",
    company: "Google",
    position: "Frontend Developer",
    status: JobStatus.APPLIED,
    appliedDate: "2024-03-20",
    resumeVersions: 2,
  },
  {
    id: "2",
    company: "Microsoft",
    position: "Full Stack Developer",
    status: JobStatus.INTERVIEW,
    appliedDate: "2024-03-18",
    resumeVersions: 1,
  },
  // Add more mock jobs as needed
];

export const JobListPage = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [filters, setFilters] = useState({
    company: "",
    position: "",
    status: "",
  });
  const navigate = useNavigate();

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

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ company: "", position: "", status: "" });
  };

  const handleAddJob = () => {
    navigate("/jobs/new");
  };

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
      />

      {filteredJobs.length > 0 ? (
        <JobsGrid>
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
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
