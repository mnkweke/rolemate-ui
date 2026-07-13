"use client";

import { useState, useCallback } from "react";
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
import { useForm, Controller } from "react-hook-form";

interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

const strengthConfig = [
  { label: "Weak", color: "bg-destructive", min: 0 },
  { label: "Fair", color: "bg-orange-500", min: 1 },
  { label: "Good", color: "bg-yellow-500", min: 2 },
  { label: "Strong", color: "bg-success", min: 3 },
];

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const cfg = strengthConfig.find((c) => score >= c.min) ?? strengthConfig[0];
  return { score, label: cfg.label, color: cfg.color };
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      groqApiKey: "",
      acceptedTerms: false,
    },
  });

  const passwordValue = watch("password", "");
  const strength = getPasswordStrength(passwordValue);

  const handleSwitchAccount = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const onSubmit = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      groqApiKey: string;
      acceptedTerms: boolean;
    }) => {
      try {
        await api.post("/auth/signup", {
          name: data.name,
          email: data.email,
          password: data.password,
          groq_api_key: data.groqApiKey,
          accepted_terms: data.acceptedTerms,
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

        if (status === 429) {
          toast({ title: "Too many attempts", description: "Please wait a moment and try again.", variant: "destructive" });
        } else if (status === 422 && Array.isArray(detail)) {
          toast({ title: "Validation error", description: detail[0].msg, variant: "destructive" });
        } else if (status === 409) {
          const msg = typeof detail === "string" ? detail : "Email already registered";
          toast({ title: "Registration failed", description: msg, variant: "destructive" });
        } else if (status === 500) {
          toast({ title: "Server error", description: "Please try again later.", variant: "destructive" });
        } else if (typeof detail === "string") {
          toast({ title: "Registration failed", description: detail, variant: "destructive" });
        } else {
          toast({ title: "Registration failed", description: "Please try again.", variant: "destructive" });
        }
      }
    },
    [router]
  );

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
          <div className="relative">
            <Input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: {
                  strength: (v) =>
                    getPasswordStrength(v).score >= 2 ||
                    "Use a mix of uppercase, numbers, or symbols",
                },
              })}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isSubmitting}
              className={cn(
                "pr-10",
                errors.password ? "border-destructive" : ""
              )}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {passwordValue && (
            <div className="mt-1 space-y-1">
              <div className="flex h-1.5 w-full gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-full flex-1 rounded-full transition-colors",
                      i < strength.score ? strength.color : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{strength.label}</p>
            </div>
          )}
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reg-confirm">Confirm password</Label>
          <div className="relative">
            <Input
              id="reg-confirm"
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (v) =>
                  v === passwordValue || "Passwords do not match",
              })}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isSubmitting}
              className={cn(
                "pr-10",
                errors.confirmPassword ? "border-destructive" : ""
              )}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowConfirm(!showConfirm)}
              tabIndex={-1}
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
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

        <div className="flex items-start gap-2">
          <Controller
            name="acceptedTerms"
            control={control}
            defaultValue={false}
            rules={{ required: "You must accept the terms and privacy policy" }}
            render={({ field: { onChange, value } }) => (
              <input
                type="checkbox"
                id="reg-terms"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-border bg-card text-primary focus:ring-primary"
                disabled={isSubmitting}
              />
            )}
          />
          <Label htmlFor="reg-terms" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" className="font-medium text-primary hover:underline" target="_blank">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-primary hover:underline" target="_blank">
              Privacy Policy
            </Link>
          </Label>
        </div>
        {errors.acceptedTerms && (
          <p className="text-xs text-destructive -mt-2">
            {errors.acceptedTerms.message}
          </p>
        )}

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
