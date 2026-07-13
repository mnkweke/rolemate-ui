"use client";

import { Suspense, useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import type { ZXCVBNResult } from "zxcvbn";
import {
  getPasswordStrength,
  isStrongEnough,
  type StrengthResult,
} from "@/lib/password-strength";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [strength, setStrength] = useState<StrengthResult>({
    score: 0,
    label: "Very Weak",
    color: "bg-destructive",
    barFill: 1,
    feedback: { warning: "", suggestions: [] },
  });
  const zxcvbnRef = useRef<((pw: string) => ZXCVBNResult) | null>(null);

  useEffect(() => {
    import("zxcvbn").then((mod) => {
      zxcvbnRef.current = mod.default;
    });
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password", "");

  useEffect(() => {
    if (zxcvbnRef.current && passwordValue) {
      const result = zxcvbnRef.current(passwordValue);
      setStrength(getPasswordStrength(result));
    } else if (!passwordValue) {
      setStrength({
        score: 0,
        label: "Very Weak",
        color: "bg-destructive",
        barFill: 1,
        feedback: { warning: "", suggestions: [] },
      });
    }
  }, [passwordValue]);

  const validateStrength = useCallback(async (v: string) => {
    if (!v) return true;
    const fn = zxcvbnRef.current;
    if (fn) {
      return isStrongEnough(fn(v).score) || "Please choose a stronger password.";
    }
    const mod = await import("zxcvbn");
    zxcvbnRef.current = mod.default;
    return isStrongEnough(mod.default(v).score) || "Please choose a stronger password.";
  }, []);

  const onSubmit = useCallback(
    async (data: { password: string }) => {
      try {
        await api.post("/auth/reset-password", {
          token,
          new_password: data.password,
        });
        setResetDone(true);
        toast({
          title: "Password updated",
          description: "You can now sign in with your new password.",
          variant: "success",
        });
      } catch (err: unknown) {
        const msg =
          (err as any)?.response?.data?.detail || "Invalid or expired reset link.";
        toast({ title: "Reset failed", description: msg, variant: "destructive" });
      }
    },
    [token]
  );

  if (!token) {
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
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Invalid link</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This password reset link is missing or invalid. Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="mt-6 text-sm font-medium text-primary hover:underline"
          >
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

  if (resetDone) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-6 w-6 text-success" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">All done!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your password has been updated successfully.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Sign in with new password
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-8 -ml-2 text-muted-foreground"
        )}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to login
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight">Set new password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your new password below.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-4"
        autoComplete="off"
      >
        <div className="grid gap-2">
          <Label htmlFor="reset-password">New password</Label>
          <div className="relative">
            <Input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: {
                  strength: validateStrength,
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
                      "h-full flex-1 rounded-full transition-all duration-300",
                      i < strength.barFill ? strength.color : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{strength.label}</p>
              {strength.feedback.warning && (
                <p className="text-xs text-destructive">{strength.feedback.warning}</p>
              )}
              {strength.feedback.suggestions.map((s, i) => (
                <p key={i} className="text-xs text-muted-foreground">{s}</p>
              ))}
            </div>
          )}
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reset-confirm">Confirm new password</Label>
          <div className="relative">
            <Input
              id="reset-confirm"
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

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Reset password"
          )}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <div className="mb-8 h-9 w-16 animate-pulse rounded bg-muted/50" />
        <div className="mb-4 h-8 w-48 animate-pulse rounded bg-muted/50" />
        <div className="mb-8 h-4 w-64 animate-pulse rounded bg-muted/50" />
        <div className="h-20 animate-pulse rounded-lg bg-muted/50" />
        <div className="h-20 animate-pulse rounded-lg bg-muted/50" />
        <div className="h-11 animate-pulse rounded-lg bg-muted/50" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
