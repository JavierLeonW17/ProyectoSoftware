import axios from "axios";

/**
 * Centralized Axios instance configuration.
 * Uses axios v1.7.9 for security stability.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.example.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add the Bearer token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle common error responses (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle logout or token refresh logic here
      console.error("Unauthorized access, redirecting to login...");
      // localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
