import axios from "axios";

// Simple API configuration
const isProduction =
  process.env.NODE_ENV === "production" ||
  window.location.hostname !== "localhost";
const API_URL = isProduction
  ? "https://track-it-app-production-bcae.up.railway.app"
  : "http://localhost:8000";

console.log("Environment:", process.env.NODE_ENV);
console.log("Is Production:", isProduction);
console.log("API URL:", API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Making request to:", config.url);
  return config;
});
