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
import { useForm } from "react-hook-form";

interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showGroqKey, setShowGroqKey] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      groqApiKey: "",
    },
  });

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

  const onSubmit = async (data: {
    name: string;
    email: string;
    password: string;
    groqApiKey: string;
  }) => {
    try {
      await api.post("/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
        groq_api_key: data.groqApiKey,
      });
      toast({
        title: "Account created successfully",
        description: "Redirecting to login...",
        variant: "success",
      });
      // Small delay to let toast be seen
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ detail: string | ValidationError[] }>;
      const status = axiosErr?.response?.status;
      const detail = axiosErr?.response?.data?.detail;

      if (status === 422 && Array.isArray(detail)) {
        // Form errors will be handled by react-hook-form via server-side? We'll show a toast with first error.
        toast({
          title: "Validation error",
          description: detail[0].msg,
          variant: "destructive",
        });
      } else if (status === 409) {
        const msg =
          typeof detail === "string" ? detail : "Email already registered";
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
        toast({
          title: "Registration failed",
          description: msg,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
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
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Get started with Rolemate
          </p>
        </div>

        {showSuccessBanner && (
          <div className="rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-400 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            Profile saved successfully
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                {...register("name", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                placeholder="John Doe"
                defaultValue=""
                autoCapitalize="words"
                autoComplete="name"
                disabled={isSubmitting}
                className={cn(
                  "w-full",
                  errors.name ? "border-destructive" : ""
                )}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                placeholder="you@example.com"
                autoComplete="email"
                autoCorrect="off"
                disabled={isSubmitting}
                className={cn(
                  "w-full",
                  errors.email ? "border-destructive" : ""
                )}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isSubmitting}
                className={cn(
                  "w-full",
                  errors.password ? "border-destructive" : ""
                )}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="groqApiKey" className="flex items-center gap-1">
                Groq API Key
                <span className="text-xs text-muted-foreground">(optional)</span>
              </Label>
              <div className="relative">
                <Input
                  id="groqApiKey"
                  type={showGroqKey ? "text" : "password"}
                  {...register("groqApiKey")}
                  placeholder="gsk_your_api_key_here"
                  autoComplete="off"
                  disabled={isSubmitting}
                  className="pr-10 w-full"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowGroqKey(!showGroqKey)}
                  tabIndex={-1}
                >
                  {showGroqKey ? (
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
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={"w-full"}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Create account"
            )}
          </Button>

          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Already have an account? Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}