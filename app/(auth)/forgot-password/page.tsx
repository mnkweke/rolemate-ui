"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, Mail, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      await api.post("/auth/forgot-password", { email: data.email });
      setSent(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

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

      {sent ? (
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            If an account with that email exists, we&apos;ve sent a password reset link.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to login
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-semibold tracking-tight">Forgot password?</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-4"
            autoComplete="off"
          >
            <div className="grid gap-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
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
                disabled={isSubmitting}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
