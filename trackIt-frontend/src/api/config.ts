import axios from "axios";

// Get API URL from environment or use production URL as fallback
const getApiUrl = () => {
  // Try to get from import.meta.env (Vite)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Try to get from window.__ENV__ (if set by server)
  if (typeof window !== "undefined" && (window as any).__ENV__?.VITE_API_URL) {
    return (window as any).__ENV__.VITE_API_URL;
  }

  // Production fallback
  if (
    window.location.hostname ===
    "track-it-app-frontend-production.up.railway.app"
  ) {
    return "https://track-it-app-backend-production.up.railway.app";
  }

  // Development fallback
  return "http://localhost:8000";
};

const API_URL = getApiUrl();
const ENV = import.meta.env.VITE_ENV || "development";

console.log("API URL:", API_URL);
console.log("Environment:", ENV);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for development logging
if (ENV === "development") {
  api.interceptors.request.use(
    (config) => {
      console.log("API Request:", {
        method: config.method,
        url: config.url,
        data: config.data,
      });
      return config;
    },
    (error) => {
      console.error("API Request Error:", error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log("API Response:", {
        status: response.status,
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.error("API Response Error:", error.response || error);
      return Promise.reject(error);
    }
  );
}

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
