// src/lib/axiosConfig.js
import axios from "axios";
import Cookies from "js-cookie"; // to store/retrieve tokens in browser cookies

// Create axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor → attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    // Prefer cookies (safer in SSR), fallback to localStorage if needed
    let token = Cookies.get("authToken") || null;

    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("authToken");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Unauthorized → clear token & redirect
        Cookies.remove("authToken");
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
