"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Target,
  Loader2,
  ChevronLeft,
  Eye,
  EyeOff,
  ExternalLink,
  Info,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getToken } from "@/lib/auth";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import type { AxiosError } from "axios";

interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [groqApiKey, setGroqApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (getToken()) {
      router.push("/dashboard");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      await api.post("/auth/signup", {
        name,
        email,
        password,
        groq_api_key: groqApiKey,
      });
      toast({
        title: "Account created successfully",
        description: "Redirecting to login...",
        variant: "success",
      });
      setTimeout(() => router.push("/login"), 1000);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{
        detail: string | ValidationError[];
      }>;
      const status = axiosErr?.response?.status;
      const detail = axiosErr?.response?.data?.detail;

      if (status === 422 && Array.isArray(detail)) {
        const msgs = detail.map((e: ValidationError) => e.msg);
        setErrors(msgs);
        toast({
          title: "Validation error",
          description: msgs[0],
          variant: "destructive",
        });
      } else if (status === 409) {
        const msg =
          typeof detail === "string" ? detail : "Email already registered";
        setErrors([msg]);
        toast({
          title: "Registration failed",
          description: msg,
          variant: "destructive",
        });
      } else {
        const msg =
          typeof detail === "string"
            ? detail
            : "Registration failed. Please try again.";
        setErrors([msg]);
        toast({
          title: "Registration failed",
          description: msg,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8",
        )}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Get started with Rolemate
          </p>
        </div>

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc pl-4 text-sm">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoCapitalize="words"
                autoComplete="name"
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="groqApiKey" className="flex items-center gap-1">
                Groq API Key
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <div className="relative">
                <Input
                  id="groqApiKey"
                  type={showKey ? "text" : "password"}
                  placeholder="gsk_your_api_key_here"
                  value={groqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  className="pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowKey(!showKey)}
                  tabIndex={-1}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
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
              <div className="mt-1 flex items-start gap-2 rounded-lg border bg-secondary/30 p-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-xs text-muted-foreground">
                  Enables AI-powered job ranking, CV optimization, and
                  recruiter-style explanations. Without it, the app uses basic
                  keyword matching.
                </p>
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create account
            </Button>
          </div>
        </form>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Already have an account? Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
