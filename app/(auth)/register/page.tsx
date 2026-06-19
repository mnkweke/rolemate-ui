"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ChevronLeft,
  Eye,
  EyeOff,
  ExternalLink,
  Info,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/components/auth/AuthContext";
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
  const { user, logout, isLoading: authLoading } = useAuth();
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: { name: "", email: "", password: "", groqApiKey: "" },
  });

  const handleSwitchAccount = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

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
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{
        detail: string | ValidationError[];
      }>;
      const status = axiosErr?.response?.status;
      const detail = axiosErr?.response?.data?.detail;

      if (status === 422 && Array.isArray(detail)) {
        toast({
          title: "Validation error",
          description: detail[0].msg,
          variant: "destructive",
        });
      } else if (status === 409) {
        const msg =
          typeof detail === "string" ? detail : "Email already registered";
        toast({ title: "Registration failed", description: msg, variant: "destructive" });
      } else {
        const msg =
          typeof detail === "string"
            ? detail
            : "Registration failed. Please try again.";
        toast({ title: "Registration failed", description: msg, variant: "destructive" });
      }
    }
  };

  if (authLoading) {
    return (
      <div>
        <div className="mb-8 h-9 w-16 animate-pulse rounded bg-muted/50" />
        <div className="mb-4 h-8 w-56 animate-pulse rounded bg-muted/50" />
        <div className="mb-8 h-4 w-48 animate-pulse rounded bg-muted/50" />
        <div className="space-y-4">
          <div className="h-20 animate-pulse rounded-lg bg-muted/50" />
          <div className="h-20 animate-pulse rounded-lg bg-muted/50" />
          <div className="h-20 animate-pulse rounded-lg bg-muted/50" />
          <div className="h-40 animate-pulse rounded-lg bg-muted/50" />
          <div className="h-11 animate-pulse rounded-lg bg-muted/50" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-8 -ml-2 text-muted-foreground"
        )}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </Link>

      {user && (
        <div className="mb-6 rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Signed in as{" "}
            <span className="font-medium text-foreground">{user.email}</span>
          </p>
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleSwitchAccount}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <LogOut className="h-3 w-3" />
            )}
            Not you? Sign out and switch account
          </button>
        </div>
      )}

      <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started with RoleMate
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-4"
        autoComplete="off"
      >
        <input
          type="text"
          name="fake-name"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          tabIndex={-1}
          autoComplete="off"
          readOnly
          aria-hidden="true"
        />
        <input
          type="email"
          name="fake-email"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          tabIndex={-1}
          autoComplete="off"
          readOnly
          aria-hidden="true"
        />
        <input
          type="password"
          name="fake-password"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          tabIndex={-1}
          autoComplete="off"
          readOnly
          aria-hidden="true"
        />

        <div className="grid gap-2">
          <Label htmlFor="reg-name">Full name</Label>
          <Input
            id="reg-name"
            {...register("name", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            placeholder="John Doe"
            autoCapitalize="words"
            autoComplete="off"
            disabled={isSubmitting}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reg-email">Email</Label>
          <Input
            id="reg-email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            placeholder="you@example.com"
            autoComplete="off"
            autoCorrect="off"
            disabled={isSubmitting}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reg-password">Password</Label>
          <Input
            id="reg-password"
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
            className={errors.password ? "border-destructive" : ""}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reg-groqApiKey" className="flex items-center gap-1">
            Groq API Key
            <span className="text-xs text-muted-foreground">(optional)</span>
          </Label>
          <div className="relative">
            <Input
              id="reg-groqApiKey"
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
          <div className="mt-1 flex items-start gap-2 rounded-lg border border-border bg-card p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">
              Enables AI-powered job ranking, CV optimization, and
              recruiter-style explanations. Without it, the app uses basic
              keyword matching.
            </p>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            or continue with
          </span>
        </div>
      </div>

      <GoogleSignInButton />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
