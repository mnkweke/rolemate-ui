"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ChevronLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/components/auth/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, logout, isLoading: authLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const handleSwitchAccount = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
      toast({ title: "Logged in successfully", variant: "success" });
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as any)?.response?.data?.detail ||
        (err as any)?.message ||
        "Invalid email or password";
      toast({ title: "Login failed", description: msg, variant: "destructive" });
    }
  };

  if (authLoading) {
    return (
      <div>
        <div className="mb-8 h-9 w-16 animate-pulse rounded bg-muted/50" />
        <div className="mb-4 h-8 w-48 animate-pulse rounded bg-muted/50" />
        <div className="mb-8 h-4 w-64 animate-pulse rounded bg-muted/50" />
        <div className="space-y-4">
          <div className="h-20 animate-pulse rounded-lg bg-muted/50" />
          <div className="h-20 animate-pulse rounded-lg bg-muted/50" />
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

      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sign in to your RoleMate account
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-4"
        autoComplete="off"
      >
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
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
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
            disabled={isSubmitting}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            placeholder="••••••••"
            autoComplete="off"
            disabled={isSubmitting}
            className={errors.password ? "border-destructive" : ""}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Sign In"
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

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="login-terms"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-border bg-card text-primary focus:ring-primary"
        />
        <Label htmlFor="login-terms" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
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

      <GoogleSignInButton termsAccepted={acceptedTerms} />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Sign Up
        </Link>
      </p>
      <p className="mt-4 text-center text-xs text-muted-foreground/60">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="font-medium text-primary hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-medium text-primary hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
