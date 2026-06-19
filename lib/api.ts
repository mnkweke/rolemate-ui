import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Remove Authorization header injection — sessions are cookie-based now
// No automatic 401 redirect here — ProtectedRoute already handles redirecting
// unauthenticated users from protected pages. An interceptor redirect would
// break the landing page (/) which also calls /auth/me on mount.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
