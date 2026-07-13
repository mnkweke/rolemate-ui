"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  has_api_key: boolean;
  auth_provider: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetched = useRef(false);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get<User>("/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchUser().finally(() => setIsLoading(false));
  }, [fetchUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      await api.post("/auth/login", { email, password });
      // Retry /auth/me with delays to let httpOnly cookies propagate
      setIsLoading(true);
      let verified = false;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const { data } = await api.get<User>("/auth/me");
          setUser(data);
          verified = true;
          break;
        } catch {
          if (attempt < 2) await new Promise((r) => setTimeout(r, 300));
        }
      }
      setIsLoading(false);
      if (!verified) {
        throw new Error("Session could not be verified after login");
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // proceed even if server logout fails
    }
    setUser(null);
    try {
      localStorage.setItem("rolemate-logout", Date.now().toString());
    } catch {
      // ignore
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await fetchUser();
    setIsLoading(false);
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
