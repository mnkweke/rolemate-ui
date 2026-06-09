"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ResumeUpload } from "@/components/profile/ResumeUpload";
import { useProfile } from "@/hooks/useProfile";
import {
  UserRound,
  Briefcase,
  MapPin,
  Target,
  FileText,
  Eye,
  EyeOff,
  Key,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Loader2,
  ExternalLink,
  Info,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function ProfilePage() {
  const {
    profile,
    isLoading,
    completionPercent,
    updateProfile,
    uploadResume,
  } = useProfile();

  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const [apiKeyStatus, setApiKeyStatus] = useState<{
    has_api_key: boolean;
    message: string;
  } | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [savingKey, setSavingKey] = useState(false);
  const [removingKey, setRemovingKey] = useState(false);

  const fetchApiKeyStatus = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/api-key-status");
      setApiKeyStatus(data);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchApiKeyStatus();
  }, [fetchApiKeyStatus]);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;
    setSavingKey(true);
    try {
      await api.post("/auth/update-api-key", { groq_api_key: apiKey });
      setApiKey("");
      await fetchApiKeyStatus();
      toast({ title: "API key saved", variant: "success" });
    } catch {
      toast({
        title: "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setSavingKey(false);
    }
  };

  const handleRemoveApiKey = async () => {
    setRemovingKey(true);
    try {
      await api.delete("/auth/api-key");
      await fetchApiKeyStatus();
      toast({ title: "API key removed", variant: "success" });
    } catch {
      toast({
        title: "Failed to remove API key",
        variant: "destructive",
      });
    } finally {
      setRemovingKey(false);
    }
  };

  const handleSave = async (data: Parameters<typeof updateProfile.mutateAsync>[0]) => {
    await updateProfile.mutateAsync(data);
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 4000);
  };

  const handleUploadResume = async (file: File) => {
    await uploadResume.mutateAsync(file);
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Manage your skills and preferences
        </p>
      </div>

      {showSuccessBanner && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-400 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-400" />
          Profile saved successfully
        </div>
      )}

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            Your Current Profile
          </CardTitle>
          <CardDescription>
            {profile
              ? "Your stored profile used for job matching"
              : "No profile yet — upload your resume or fill in the form below"}
          </CardDescription>
        </CardHeader>
        {profile ? (
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills?.map((s: string) => (
                  <Badge key={s} variant="success">{s}</Badge>
                ))}
                {(!profile.skills || profile.skills.length === 0) && (
                  <span className="text-sm text-muted-foreground">None added</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-md border bg-secondary/30 px-3 py-1.5 text-sm">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Seniority:</span>
                <span className="font-medium capitalize">
                  {profile.seniority || (
                    <span className="text-muted-foreground italic">Not set</span>
                  )}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-md border bg-secondary/30 px-3 py-1.5 text-sm">
                <Target className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Experience:</span>
                <span className="font-medium">
                  {profile.years_experience ?? 0} years
                </span>
              </div>
            </div>

            {(profile.preferred_roles?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Preferred roles
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.preferred_roles?.map((r: string) => (
                    <Badge key={r} variant="warning">{r}</Badge>
                  ))}
                </div>
              </div>
            )}

            {(profile.preferred_locations?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Preferred locations
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.preferred_locations?.map((l: string) => (
                    <Badge key={l} variant="secondary">{l}</Badge>
                  ))}
                </div>
              </div>
            )}

            {profile.background && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Background</h4>
                <p className="text-sm text-foreground/90 bg-muted/50 rounded-md p-3">
                  {profile.background}
                </p>
              </div>
            )}

            {profile.current_goal && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Current goal</h4>
                <p className="text-sm text-foreground/90 bg-muted/50 rounded-md p-3">
                  {profile.current_goal}
                </p>
              </div>
            )}
          </CardContent>
        ) : (
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <UserRound className="h-12 w-12 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                No profile yet &mdash; upload your resume or fill in the form below
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {profile && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={completionPercent} className="flex-1" />
              <span className="text-sm font-medium">{completionPercent}%</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="manual" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manual">Manual Input</TabsTrigger>
          <TabsTrigger value="resume">Resume Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <ProfileForm
            profile={profile}
            onSave={handleSave}
            isLoading={updateProfile.isPending}
          />
        </TabsContent>
        <TabsContent value="resume">
          <ResumeUpload
            onUpload={handleUploadResume}
            extractedProfile={profile}
            isLoading={uploadResume.isPending}
          />
        </TabsContent>
      </Tabs>

      {/* API Key Section */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Groq API Key
          </CardTitle>
          <CardDescription>
            Required for AI-powered job ranking and CV optimization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Get your free API key at{" "}
            <a
              href="https://console.groq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              console.groq.com
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>

          {apiKeyStatus === null ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking API key status...
            </div>
          ) : apiKeyStatus.has_api_key ? (
            <div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/10 p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">
                  API key configured
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveApiKey}
                disabled={removingKey}
                className="border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                {removingKey ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span className="ml-1">Remove</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">
                No API key set &mdash; AI features disabled
              </span>
            </div>
          )}

          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type={showApiKey ? "text" : "password"}
                placeholder="gsk_your_api_key_here"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <Button
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim() || savingKey}
            >
              {savingKey && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {apiKeyStatus?.has_api_key ? "Update Key" : "Save Key"}
            </Button>
          </div>

          <div className="flex items-start gap-2 rounded-lg border bg-secondary/30 p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">
              Your API key is encrypted and stored securely. It enables Groq-powered AI features
              for ranking jobs against your profile and optimizing your CV. Without it, the app
              falls back to basic keyword matching.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
