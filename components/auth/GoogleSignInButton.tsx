"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuth } from "@/components/auth/AuthContext";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (momentListener?: (moment: { type: string }) => void) => void;
        };
      };
    };
  }
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function GoogleSignInButton() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    if (initialized.current) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    initialized.current = true;
  }, []);

  const handleGoogleResponse = useCallback(
    async (response: { credential: string }) => {
      setLoading(true);
      try {
        await api.post("/auth/google", {
          id_token: response.credential,
        });
        await refresh();
        toast({ title: "Signed in successfully", variant: "success" });
        router.push("/dashboard");
      } catch (err: unknown) {
        const axiosErr = (err as any)?.response?.data;
        const msg =
          axiosErr?.detail ||
          axiosErr?.error ||
          (err as any)?.message ||
          "Google sign-in failed";
        toast({
          title: "Authentication failed",
          description: msg,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [router, refresh]
  );

  const handleClick = useCallback(() => {
    if (!GOOGLE_CLIENT_ID) {
      toast({
        title: "Google sign-in not configured",
        description: "Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment",
        variant: "destructive",
      });
      return;
    }

    if (!window.google?.accounts) {
      toast({
        title: "Google sign-in loading",
        description: "Please try again in a moment",
        variant: "destructive",
      });
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: false,
    });

    window.google.accounts.id.prompt();
  }, [handleGoogleResponse]);

  return (
    <Button
      variant="outline"
      className="w-full gap-2"
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      ) : (
        <GoogleIcon className="h-4 w-4" />
      )}
      Continue with Google
    </Button>
  );
}
