"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Clock,
  UserCheck,
  TrendingUp,
  Send,
  Loader2,
  RefreshCw,
  CheckCircle2,
  FileText,
  CalendarCheck,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { JobList } from "@/components/jobs/JobList";
import { useJobs } from "@/hooks/useJobs";
import { useProfile } from "@/hooks/useProfile";
import { useApplications } from "@/hooks/useApplications";
import { getSessionId } from "@/lib/auth";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [quickQuery, setQuickQuery] = useState("");
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const { jobs, isLoading: jobsLoading, scrapeJobs } = useJobs({ limit: 5 });
  const { profile, completionPercent } = useProfile();
  const { applications } = useApplications();

  useEffect(() => {
    api.get("/auth/api-key-status").then(({ data }) => {
      setHasApiKey(data.has_api_key);
    }).catch(() => setHasApiKey(false));
  }, []);

  useEffect(() => {
    console.log("[Dashboard] session_id:", getSessionId());
    console.log("[Dashboard] profile:", profile);
    console.log("[Dashboard] completionPercent:", completionPercent);
    console.log("[Dashboard] skills:", profile?.skills);
  }, [profile, completionPercent]);

  const handleScrape = async () => {
    try {
      const result = await scrapeJobs.mutateAsync();
      const total = result.results?.total ?? 0;
      const detail = result.results
        ? Object.entries(result.results)
            .filter(([k]) => k !== "total")
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")
        : `${total} jobs`;
      toast({
        title: "Scrape complete",
        description: `${total} jobs indexed (${detail})`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Scrape failed",
        description: "Could not scrape jobs",
        variant: "destructive",
      });
    }
  };

  const handleQuickChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      router.push(`/chat?q=${encodeURIComponent(quickQuery.trim())}`);
    }
  };

  const topSkills = profile?.skills?.slice(0, 5) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your job search
        </p>
      </div>

      {hasApiKey === false && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 shrink-0" />
            <div>
              <p className="text-yellow-300 font-medium text-sm">AI features disabled</p>
              <p className="text-yellow-500 text-xs mt-0.5">
                Add your Groq API key to enable AI job ranking and CV optimization
              </p>
            </div>
          </div>
          <Link href="/profile">
            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white shrink-0">
              Add API Key
            </Button>
          </Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Jobs
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                jobs.length
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Profile
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completionPercent}%
            </div>
            {profile ? (
              <Badge variant="success" className="mt-1">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Profile Complete
              </Badge>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                Setup Profile
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Applications Sent
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications?.total_applied ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Interviews
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications?.interviews_invited ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Interview invitations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Top Skills
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {topSkills.length > 0 ? (
                topSkills.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">
                    {s}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  No skills yet
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Last Scrape
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              N/A
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleScrape}
              disabled={scrapeJobs.isPending}
            >
              {scrapeJobs.isPending ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              Scrape now
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleQuickChat} className="flex gap-2">
            <Input
              placeholder="Describe your ideal job..."
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!quickQuery.trim()}>
              <Send className="h-4 w-4 mr-1" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Jobs</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/jobs")}
          >
            View all
          </Button>
        </div>
        <JobList
          jobs={jobs}
          isLoading={jobsLoading}
          emptyMessage="No jobs yet. Scrape some first!"
        />
      </div>
    </div>
  );
}
