import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const ENV = import.meta.env.VITE_ENV || "development";

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
