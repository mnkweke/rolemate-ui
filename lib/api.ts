import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Remove Authorization header injection — sessions are cookie-based now
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const publicPaths = ["/login", "/register"];
        if (!publicPaths.includes(window.location.pathname)) {
          // Redirect to login on unauthorized when not already on a public auth page
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
