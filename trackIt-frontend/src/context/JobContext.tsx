import React, { createContext, useContext, useState, useEffect } from "react";
import type { Job } from "../types/types";
import { JobStatus } from "../types/types";
import { useAuth } from "./AuthContext";
import { api } from "../api/config.js";

interface JobContextType {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  loading: boolean;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

const sampleJobs: Job[] = [
  {
    id: 1,
    company: "Google",
    position: "Full Stack Developer",
    status: JobStatus.APPLIED,
    notes: "Applied through company website. Following up next week.",
    applied_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    resumes: [],
  },
  {
    id: 2,
    company: "Microsoft",
    position: "Frontend Engineer",
    status: JobStatus.INTERVIEWING,
    notes:
      "Technical interview scheduled for next week. Preparing LeetCode problems.",
    applied_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    resumes: [],
  },
  {
    id: 3,
    company: "Amazon",
    position: "Software Development Engineer",
    status: JobStatus.REJECTED,
    notes:
      "Got feedback: 'Good technical skills but looking for more experience'.",
    applied_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    resumes: [],
  },
  {
    id: 4,
    company: "Apple",
    position: "iOS Developer",
    status: JobStatus.ACCEPTED,
    notes: "Offer received! Reviewing compensation package.",
    applied_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    resumes: [],
  },
];

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isGuest } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      if (!isAuthenticated) {
        setJobs([]);
        setLoading(false);
        return;
      }

      if (isGuest) {
        // For guest users, load sample jobs
        setJobs(sampleJobs);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching jobs from:", api.defaults.baseURL);
        const response = await api.get("/api/jobs/");
        console.log("Jobs response:", response.data);
        setJobs(response.data);
      } catch (error: any) {
        console.error("Error fetching jobs:", error);
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
        // Set empty jobs array on error
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isAuthenticated, isGuest]);

  return (
    <JobContext.Provider value={{ jobs, setJobs, loading }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};
