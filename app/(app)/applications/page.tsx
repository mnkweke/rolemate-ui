"use client";

import { useState } from "react";
import {
  Briefcase,
  Building2,
  ExternalLink,
  FileText,
  CalendarCheck,
  X,
  Clock,
  TrendingDown,
  Award,
  Ban,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApplications } from "@/hooks/useApplications";
import type { ApplicationRecord } from "@/types";

const statusColors: Record<string, string> = {
  applied: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  interview_invited: "bg-green-500/20 text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  offer: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  withdrawn: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const statusLabels: Record<string, string> = {
  applied: "Applied",
  interview_invited: "Interview",
  rejected: "Rejected",
  offer: "Offer",
  withdrawn: "Withdrawn",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const FILTERS = ["all", "applied", "interview_invited", "offer", "rejected"] as const;
type FilterValue = (typeof FILTERS)[number];

export default function ApplicationsPage() {
  const router = useRouter();
  const { applications, isLoading, updateStatusMutation, refetch } = useApplications();
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    app: ApplicationRecord | null;
  }>({ open: false, app: null });
  const [newStatus, setNewStatus] = useState("interview_invited");
  const [feedback, setFeedback] = useState("");

  const filteredApps = (applications?.applications ?? []).filter((app) => {
    if (activeFilter === "all") return true;
    return app.status === activeFilter;
  });

  const handleUpdateStatus = async () => {
    if (!statusDialog.app) return;
    await updateStatusMutation.mutateAsync({
      appId: statusDialog.app.id,
      status: newStatus,
      feedback,
    });
    setStatusDialog({ open: false, app: null });
    setNewStatus("interview_invited");
    setFeedback("");
  };

  const statsCards = [
    {
      title: "Total Applied",
      value: applications?.total_applied ?? 0,
      icon: Send,
      color: "text-blue-400",
    },
    {
      title: "Interviews Invited",
      value: applications?.interviews_invited ?? 0,
      icon: CalendarCheck,
      color: "text-green-400",
    },
    {
      title: "Offers",
      value: applications?.offers ?? 0,
      icon: Award,
      color: "text-yellow-400",
    },
    {
      title: "Rejected",
      value: applications?.rejected ?? 0,
      icon: TrendingDown,
      color: "text-red-400",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Applications</h2>
          <p className="text-muted-foreground">Track your job applications</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="py-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!applications || applications.applications.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Applications</h2>
          <p className="text-muted-foreground">Track your job applications</p>
        </div>
        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No applications yet</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Go to Apply to start applying to jobs. Your applications and their
              statuses will appear here.
            </p>
            <Button size="lg" onClick={() => router.push("/apply")}>
              <Send className="h-4 w-4 mr-2" />
              Go to Apply
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Applications</h2>
        <p className="text-muted-foreground">Track your job applications</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {FILTERS.map((f) => (
          <Button
            key={f}
            variant={activeFilter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(f)}
            className="shrink-0 capitalize"
          >
            {f === "interview_invited" ? "Interview" : f}
          </Button>
        ))}
      </div>

      {/* Application list */}
      <div className="space-y-2">
        {filteredApps.length === 0 ? (
          <Card className="py-8">
            <CardContent className="text-center text-sm text-muted-foreground">
              No applications with status &quot;{activeFilter}&quot;.
            </CardContent>
          </Card>
        ) : (
          filteredApps.map((app) => (
            <Card key={app.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{app.job_title}</span>
                    <span className="text-sm text-muted-foreground shrink-0">
                      at {app.company}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <div
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                        statusColors[app.status] ?? ""
                      }`}
                    >
                      {statusLabels[app.status] ?? app.status}
                    </div>
                    <Badge
                      variant={
                        app.match_score >= 80
                          ? "success"
                          : app.match_score >= 60
                          ? "warning"
                          : "danger"
                      }
                      className="text-xs"
                    >
                      {app.match_score}%
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(app.applied_date)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(app.job_url, "_blank")}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    View Job
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setStatusDialog({ open: true, app });
                      setNewStatus(app.status);
                      setFeedback(app.feedback || "");
                    }}
                  >
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Update Status Dialog */}
      <Dialog
        open={statusDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setStatusDialog({ open: false, app: null });
            setNewStatus("interview_invited");
            setFeedback("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              {statusDialog.app?.job_title} at {statusDialog.app?.company}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="applied">Applied</option>
                <option value="interview_invited">Interview Invited</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback (optional)</Label>
              <Textarea
                id="feedback"
                placeholder="Any notes or feedback about this application..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setStatusDialog({ open: false, app: null });
                setNewStatus("interview_invited");
                setFeedback("");
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <span className="flex items-center gap-1">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Updating...
                </span>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
