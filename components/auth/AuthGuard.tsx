"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

/** Redirects unauthenticated users to /login */
export function ProtectedRoute({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}

/** Redirects authenticated users away from public pages (login/register) */
// Intentionally removed — login/register pages always render their UI.
// They show an "already signed in" banner instead of auto-redirecting.
// Users can switch accounts from the login page directly.
