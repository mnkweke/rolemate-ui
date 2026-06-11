"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  ExternalLink,
  ArrowRight,
  Sparkles,
  FileText,
  Briefcase,
  MapPin,
  Building2,
  AlertTriangle,
  Upload,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getSessionId } from "@/lib/auth";
import api from "@/lib/api";
import type { ChatResponse, ApplyResponse, ApplyRequest } from "@/types";

const STEPS = ["Select Jobs", "Review CV", "Confirmation"];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function cvDownloadUrl(jobId: string) {
  return `${API_BASE}/cv/download/${jobId}`;
}

export default function ApplyPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [chatData, setChatData] = useState<ChatResponse | null>(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedPreviews, setOptimizedPreviews] = useState<Record<string, string>>({});
  const [activeJobTab, setActiveJobTab] = useState<string | null>(null);
  const [applyResponse, setApplyResponse] = useState<ApplyResponse | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [originalCV, setOriginalCV] = useState<string | null>(null);
  const [loadingCV, setLoadingCV] = useState(true);
  const [cvError, setCvError] = useState<string | null>(null);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      setError(event.message ?? "An unexpected error occurred");
    };
    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  useEffect(() => {
    const fetchCV = async () => {
      setLoadingCV(true);
      try {
        const { data } = await api.get<{ cv: string | null; error?: string }>("/cv");
        if (data.cv) {
          setOriginalCV(data.cv);
          setCvError(null);
        } else {
          setOriginalCV(null);
          setCvError(data.error ?? "No CV uploaded yet");
        }
      } catch {
        setCvError("Could not load CV. Backend may be unavailable.");
      } finally {
        setLoadingCV(false);
      }
    };
    fetchCV();
  }, []);

  const fetchJobs = async () => {
    setLoadingChat(true);
    try {
      const sessionId = getSessionId();

      const profileRes = await api.get("/profile");
      const profile = profileRes.data?.profile;

      const role = profile?.preferred_roles?.[0] || "professional role";
      const query = `Find me the best ${role} jobs matching my profile`;

      const { data } = await api.post<ChatResponse>("/chat", {
        session_id: sessionId,
        message: query,
      });
      setChatData(data);
    } catch {
      setApplyError("Failed to fetch jobs. Make sure the backend is running.");
    } finally {
      setLoadingChat(false);
    }
  };

  const sortedJobs = useMemo(() => {
    if (!chatData?.ranked_jobs) return [];
    return [...chatData.ranked_jobs].sort((a, b) => b.match_score - a.match_score);
  }, [chatData]);

  const toggleJob = (jobId: string) => {
    setSelectedIds(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const selectAllScore = (minScore: number) => {
    setSelectedIds(
      sortedJobs
        .filter((j) => j.match_score >= minScore)
        .map((j) => j.id)
    );
  };

  const selectedJobs = sortedJobs.filter((j) => selectedIds.includes(j.id));

  const handleReviewCV = async () => {
    setStep(1);
    setOptimizing(true);
    const previews: Record<string, string> = {};
    for (const job of selectedJobs) {
      try {
        const sessionId = getSessionId();
        const payload: ApplyRequest = {
          session_id: sessionId,
          selected_job_ids: [job.id],
        };
        const { data } = await api.post<ApplyResponse>("/apply", payload);
        console.log("handleReviewCV raw response:", JSON.stringify(data));
        const result = data.pending?.[0];
        if (result?.application_id) {
          previews[job.id] = `Optimized CV for ${job.title} at ${job.company}\n\nCV optimization is running in the background. The tailored CV will be available shortly.`;
        } else {
          previews[job.id] = `Optimization queued for ${job.title}. The generated CV will reference your original CV content tailored for this role.`;
        }
      } catch (e) {
        console.error("handleReviewCV error for job", job.id, e);
        previews[job.id] = `Failed to optimize CV for ${job.title}. Using original CV.`;
      }
    }
    setOptimizedPreviews(previews);
    setActiveJobTab(selectedJobs[0]?.id ?? null);
    setOptimizing(false);
  };

  const handleApply = async () => {
    setOptimizing(true);
    setApplyError(null);
    try {
      const sessionId = getSessionId();
      const payload: ApplyRequest = {
        session_id: sessionId,
        selected_job_ids: selectedJobs.map((j) => j.id),
      };
      const { data } = await api.post<ApplyResponse>("/apply", payload);
      console.log("handleApply raw response:", JSON.stringify(data));
      const results = (data.pending ?? []).map((p) => ({
        job_id: p.job_id,
        application_id: p.application_id,
        job_title: p.job_title,
        company: p.company,
        job_url: p.job_url ?? "",
        status: "pending",
        applied: false,
        requires_manual: false,
        cv_optimized: false,
      }));
      setApplyResponse({ ...data, results, applied: 0, email_drafts: 0, manual_required: 0 });
      setStep(2);
    } catch (e) {
      console.error("handleApply error:", e);
      setApplyError("Application failed. Please try again.");
    } finally {
      setOptimizing(false);
    }
  };

  const handleApproveOne = async (jobId: string) => {
    setOptimizing(true);
    try {
      const sessionId = getSessionId();
      const payload: ApplyRequest = {
        session_id: sessionId,
        selected_job_ids: [jobId],
      };
      const { data } = await api.post<ApplyResponse>("/apply", payload);
      console.log("handleApproveOne raw response:", JSON.stringify(data));
      const results = (data.pending ?? []).map((p) => ({
        job_id: p.job_id,
        application_id: p.application_id,
        job_title: p.job_title,
        company: p.company,
        job_url: p.job_url ?? "",
        status: "pending",
        applied: false,
        requires_manual: false,
        cv_optimized: false,
      }));
      setApplyResponse({ ...data, results, applied: 0, email_drafts: 0, manual_required: 0 });
      setStep(2);
    } catch (e) {
      console.error("handleApproveOne error:", e);
      setApplyError("Application failed for this job.");
    } finally {
      setOptimizing(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const scoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500/10 border-green-500/30";
    if (score >= 60) return "bg-yellow-500/10 border-yellow-500/30";
    return "bg-red-500/10 border-red-500/30";
  };

  const badgeVariant = (score: number) => {
    if (score >= 80) return "success" as const;
    if (score >= 60) return "warning" as const;
    return "danger" as const;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Apply to Jobs</h2>
        </div>
        <Card className="border-red-500/30 bg-red-500/10 py-12">
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-12 w-12 text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">Something went wrong</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!chatData && !loadingChat) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Apply to Jobs</h2>
          <p className="text-muted-foreground">
            Find matching jobs, optimize your CV, and apply automatically
          </p>
        </div>

        {cvError && !loadingCV && (
          <Card className="border-yellow-500/30 bg-yellow-500/10">
            <CardContent className="flex items-center gap-3 py-4">
              <Upload className="h-5 w-5 text-yellow-400 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-400">No CV found</p>
                <p className="text-muted-foreground">
                  Upload your CV first in the{" "}
                  <button
                    className="underline text-primary hover:text-primary/80"
                    onClick={() => router.push("/profile")}
                  >
                    Profile section
                  </button>{" "}
                  before applying to jobs.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
            <Send className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Ready to start applying?</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              We&apos;ll search for the best jobs matching your profile, optimize
              your CV for each position, and help you apply.
            </p>
            <Button size="lg" onClick={fetchJobs} disabled={loadingCV}>
              {loadingCV ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Find Matching Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loadingChat) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Apply to Jobs</h2>
        </div>
        <Card className="py-16">
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Searching for matching jobs...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Apply to Jobs</h2>
        <p className="text-muted-foreground">
          {chatData?.market_insight ?? "Optimize and apply to matching jobs"}
        </p>
      </div>

      {cvError && step === 0 && (
        <Card className="border-yellow-500/30 bg-yellow-500/10">
          <CardContent className="flex items-center gap-3 py-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0" />
            <p className="text-sm text-muted-foreground">
              No CV uploaded yet. Your current resume text won&apos;t be available for
              optimization.{" "}
              <button
                className="underline text-primary hover:text-primary/80"
                onClick={() => router.push("/profile")}
              >
                Upload your CV
              </button>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i < step
                  ? "bg-green-500/20 text-green-400"
                  : i === step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`text-sm ${
                i === step ? "font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
            )}
          </div>
        ))}
      </div>

      {applyError && (
        <Card className="border-red-500/30 bg-red-500/10">
          <CardContent className="py-3 text-sm text-red-400">{applyError}</CardContent>
        </Card>
      )}

      {step === 0 && (
        <>
          {/* Quick select buttons */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground mr-2">Quick select:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds(sortedJobs.map(j => j.id))}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectAllScore(100)}
            >
              All 100%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectAllScore(80)}
            >
              Select 80%+
            </Button>
            <div className="flex-1" />
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} selected
            </span>
          </div>

          {/* Job list */}
          <div className="space-y-2">
            {sortedJobs.map((job) => (
              <Card
                key={job.id}
                className={`transition-all cursor-pointer ${
                  selectedIds.includes(job.id) ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => toggleJob(job.id)}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(job.id)}
                    onChange={() => toggleJob(job.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{job.title}</p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {job.source}
                          </Badge>
                        </div>
                      </div>
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${scoreBg(job.match_score)}`}
                      >
                        <span className={`text-sm font-bold ${scoreColor(job.match_score)}`}>
                          {job.match_score}%
                        </span>
                      </div>
                    </div>
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.skills.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              size="lg"
              disabled={selectedIds.length === 0}
              onClick={handleReviewCV}
            >
              Continue to CV Review ({selectedIds.length} jobs)
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          {/* Job tabs for CV switching */}
          {selectedJobs.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {selectedJobs.map((job) => (
                <Button
                  key={job.id}
                  variant={activeJobTab === job.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveJobTab(job.id)}
                  className="shrink-0"
                >
                  <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                  {job.title}
                </Button>
              ))}
            </div>
          )}

          {selectedJobs.map((job) => {
            if (activeJobTab && activeJobTab !== job.id) return null;
            return (
              <div key={job.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {job.company} &middot; {job.location}
                      <Badge
                        variant={badgeVariant(job.match_score)}
                        className="ml-2"
                      >
                        {job.match_score}% match
                      </Badge>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(job.url, "_blank")}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    View Job
                  </Button>
                </div>

                {/* Side by side CV comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Original CV
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingCV ? (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      ) : originalCV ? (
                        <div className="text-sm whitespace-pre-wrap font-mono text-xs leading-relaxed max-h-96 overflow-y-auto text-foreground/80">
                          {originalCV}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 py-8 text-center">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            No CV uploaded yet.{" "}
                            <button
                              className="underline text-primary"
                              onClick={() => router.push("/profile")}
                            >
                              Upload your CV
                            </button>
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Optimized for {job.company}
                      </CardTitle>
                      {optimizedPreviews[job.id] && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(cvDownloadUrl(job.id), "_blank")}
                          className="ml-auto"
                        >
                          Download PDF
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      {optimizing ? (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-2/3" />
                          <Skeleton className="h-4 w-4/5" />
                        </div>
                      ) : (
                        <div className="text-sm whitespace-pre-wrap font-mono text-xs leading-relaxed max-h-96 overflow-y-auto text-foreground/80">
                          {optimizedPreviews[job.id] ??
                            "Click 'Approve & Apply' to generate the optimized CV."}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep(0)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={() => handleApproveOne(job.id)}
                    disabled={optimizing}
                  >
                    {optimizing ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    Approve &amp; Apply
                  </Button>
                </div>
              </div>
            );
          })}

          {selectedJobs.length > 1 && (
            <div className="flex justify-end pt-4 border-t mt-6">
              <Button
                size="lg"
                onClick={handleApply}
                disabled={optimizing}
              >
                {optimizing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Approve All &amp; Apply ({selectedJobs.length} jobs)
              </Button>
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {/* Summary card */}
          <Card className="py-8">
            <CardContent className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
                <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold">
                {applyResponse?.total ?? 0} job
                {(applyResponse?.total ?? 0) !== 1 ? "s" : ""} submitted for processing
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Your applications are being processed in the background. CV optimization and auto-apply will complete shortly. Check the Applications page for real-time status updates.
              </p>
            </CardContent>
          </Card>

          {/* Applied successfully */}
          {(applyResponse?.results ?? []).filter(r => r.status === 'applied').length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Applied Successfully
              </h4>
              <div className="space-y-2">
                {(applyResponse?.results ?? []).filter(r => r.status === 'applied').map(r => (
                  <div key={r.job_id} className="border border-green-500/30 bg-green-500/5 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{r.job_title}</p>
                        <p className="text-xs text-muted-foreground">{r.company}</p>
                      </div>
                      <Badge variant="success" className="text-xs">Applied</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{r.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email drafts ready for approval */}
          {(applyResponse?.results ?? []).filter(r => r.status === 'email_draft_ready').length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
                <span className="text-base">📧</span>
                Email Drafts Ready for Approval
              </h4>
              <div className="space-y-2">
                {(applyResponse?.results ?? []).filter(r => r.status === 'email_draft_ready').map(r => (
                  <div key={r.job_id} className="border border-blue-500/30 bg-blue-500/5 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium">{r.job_title}</p>
                        <p className="text-xs text-muted-foreground">{r.company}</p>
                      </div>
                      <Badge variant="warning" className="text-xs">Draft Ready</Badge>
                    </div>
                    {r.email_draft && (
                      <div className="bg-gray-800/50 rounded p-2 text-xs space-y-1 mb-2">
                        <p><span className="text-muted-foreground">To:</span> {r.email_draft.to}</p>
                        <p><span className="text-muted-foreground">Subject:</span> {r.email_draft.subject}</p>
                        <pre className="whitespace-pre-wrap text-xs mt-1 text-muted-foreground font-sans">
                          {r.email_draft.body}
                        </pre>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={async () => {
                          try {
                            await api.post(`/applications/${r.application_id}/send-email`);
                            setApplyResponse(prev => prev ? {
                              ...prev,
                              results: (prev.results ?? []).map(rr =>
                                rr.application_id === r.application_id
                                  ? { ...rr, status: 'applied', applied: true }
                                  : rr
                              ),
                              applied: (prev.applied ?? 0) + 1,
                              email_drafts: (prev.email_drafts ?? 1) - 1,
                            } : prev);
                          } catch (e) {
                            setApplyError("Failed to send email. Please try again.");
                          }
                        }}
                      >
                        Approve & Send Email
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`mailto:${r.email_draft?.to}?subject=${encodeURIComponent(r.email_draft?.subject || '')}&body=${encodeURIComponent(r.email_draft?.body || '')}`, '_blank')}
                      >
                        Open in Mail Client
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manual apply required */}
          {(applyResponse?.results ?? []).filter(r => r.requires_manual).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Manual Applications Required
              </h4>
              <div className="space-y-2">
                {(applyResponse?.results ?? []).filter(r => r.requires_manual).map(r => (
                  <div key={r.job_id} className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{r.job_title}</p>
                        <p className="text-xs text-muted-foreground">{r.company}</p>
                      </div>
                      <Badge variant="warning" className="text-xs">Manual</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{r.message}</p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(r.job_url, '_blank')}
                      >
                        Apply Manually <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(cvDownloadUrl(r.job_id), '_blank')}
                      >
                        Download CV
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-center gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router.push("/chat")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Chat
            </Button>
            <Button onClick={() => router.push("/applications")}>
              View Applications
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
