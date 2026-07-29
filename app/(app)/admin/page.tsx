"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import {
  Briefcase,
  Database,
  Globe,
  Layers,
  Loader2,
  RefreshCw,
  Activity,
  Clock,
  AlertTriangle,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats, useSyncJobs } from "@/hooks/useAdminJobs";
import { timeAgo } from "@/lib/timeAgo";

const sourceColors: Record<string, string> = {
  jobberman: "bg-blue-500",
  myjobmag: "bg-green-500",
  hotnigerianjobs: "bg-orange-500",
  linkedin_nigeria: "bg-indigo-500",
  indeed_nigeria: "bg-red-500",
};

const categoryColors: Record<string, string> = {
  software_engineering: "bg-blue-500",
  data_analysis: "bg-purple-500",
  data_science: "bg-violet-500",
  ai_ml: "bg-pink-500",
  product_management: "bg-amber-500",
  ui_ux: "bg-rose-500",
  devops: "bg-cyan-500",
  cybersecurity: "bg-red-600",
  marketing: "bg-emerald-500",
  sales: "bg-teal-500",
  finance: "bg-yellow-600",
  customer_support: "bg-slate-500",
};

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [syncStarted, setSyncStarted] = useState(false);
  const { data: stats, isLoading, error } = useAdminStats();
  const syncJobs = useSyncJobs();

  const handleSync = useCallback(() => {
    setSyncStarted(true);
    syncJobs.mutate(undefined, {
      onSettled: () => {
        setTimeout(() => setSyncStarted(false), 10000);
      },
    });
  }, [syncJobs]);

  useEffect(() => {
    if (!authLoading && (!user || !user.is_admin)) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || !user.is_admin) {
    return null;
  }

  if (error) {
    const axiosError = error as { response?: { status?: number }; message?: string };
    const isForbidden = axiosError?.response?.status === 403;

    if (isForbidden) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Shield className="h-16 w-16 text-red-400" />
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground text-center max-w-md">
            You do not have admin privileges. Contact your administrator if you need access.
          </p>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
        <p className="text-red-400 text-sm">Failed to load stats: {axiosError?.message ?? "Unknown error"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Nigerian job aggregation management
          </p>
        </div>
        <div className="flex items-center gap-3">
          {syncStarted && (
            <Badge variant="secondary" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Sync in progress...
            </Badge>
          )}
          <Button
            onClick={handleSync}
            disabled={syncJobs.isPending || syncStarted}
          >
            {syncJobs.isPending || syncStarted ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sync Now
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.total_jobs ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.active_jobs ?? 0} active
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.active_jobs ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.failed_imports ?? 0} inactive / expired
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Added Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.jobs_added_today ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  in the last 24h
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-lg font-bold">
                  {stats?.last_sync_time ? timeAgo(stats.last_sync_time) : "Never"}
                </div>
                {syncStarted && (
                  <Badge variant="secondary" className="mt-1">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Syncing...
                  </Badge>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {syncJobs.isSuccess && syncStarted && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          <p className="text-sm text-green-300">Sync triggered. Results will appear shortly.</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Jobs by Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : stats?.jobs_by_source && Object.keys(stats.jobs_by_source).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.jobs_by_source)
                  .sort(([, a], [, b]) => b - a)
                  .map(([source, count]) => (
                    <div key={source} className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${sourceColors[source] ?? "bg-gray-400"}`} />
                      <span className="text-sm capitalize flex-1">{source.replace(/_/g, " ")}</span>
                      <span className="text-sm font-bold">{count}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Jobs by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : stats?.jobs_by_category && Object.keys(stats.jobs_by_category).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.jobs_by_category)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${categoryColors[category] ?? "bg-gray-400"}`} />
                      <span className="text-sm capitalize flex-1">{category.replace(/_/g, " ")}</span>
                      <span className="text-sm font-bold">{count}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
