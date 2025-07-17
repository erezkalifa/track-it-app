import axios from "axios";

// src/api/config.ts

const localUrl = "http://localhost:8000";

const prodUrl = "https://track-it-app-production-bcae.up.railway.app";

export const API_URL =
  window.location.hostname === "localhost" ? localUrl : prodUrl;

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Making request to:", config.url);
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
      },
    });
    return Promise.reject(error);
  }
);
