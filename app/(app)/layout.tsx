"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import api from "@/lib/api";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [networkError, setNetworkError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api
      .get("/auth/me")
      .then(() => {
        if (mounted) setIsLoading(false);
      })
      .catch((err: any) => {
        if (!mounted) return;
        const status = err?.response?.status;
        if (status === 401) {
          router.push("/login");
        } else {
          // network or server error — show retry UI
          setNetworkError(
            "Unable to validate session — please check your network and try again"
          );
          setIsLoading(false);
        }
      });

    // listen for cross-tab logout
    const onStorage = (e: StorageEvent) => {
      if (e.key === "rolemate-logout") {
        router.push("/login");
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-64">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
