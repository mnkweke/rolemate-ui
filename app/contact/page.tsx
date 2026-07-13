"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, Send, Mail, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import type { AxiosError } from "axios";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (data: { name: string; email: string; subject: string; message: string }) => {
    try {
      await api.post("/contact", data);
      setSent(true);
      reset();
      toast({ title: "Message sent successfully", description: "We'll get back to you as soon as possible.", variant: "success" });
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      const status = axiosErr?.response?.status;
      const detail = axiosErr?.response?.data?.detail;

      if (status === 429) {
        toast({ title: "Too many attempts", description: "Please wait a moment and try again.", variant: "destructive" });
      } else if (typeof detail === "string") {
        toast({ title: "Unable to send message", description: detail, variant: "destructive" });
      } else {
        toast({ title: "Unable to send your message right now", description: "Please try again later.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <img src="/assets/irla-logo.jpeg" alt="Irla logo" className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-sm font-semibold">RoleMate</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-8 -ml-2 text-muted-foreground")}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Link>

          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold tracking-tight">Contact us</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Have a question, feedback, or need help? We&apos;d love to hear from you.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">hello@irlastudio.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Response time</p>
                    <p className="text-sm text-muted-foreground">Usually replies within 1&ndash;2 business days.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-2 text-sm text-muted-foreground">
                <Link href="/privacy" className="block text-primary hover:underline">Privacy Policy</Link>
                <Link href="/terms" className="block text-primary hover:underline">Terms of Service</Link>
              </div>
            </div>

            <div className="lg:col-span-3">
              {sent ? (
                <div className="flex flex-col items-center rounded-2xl border border-border/50 bg-card p-10 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle2 className="h-7 w-7 text-success" />
                  </div>
                  <h2 className="text-xl font-semibold">Message sent successfully</h2>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    We&apos;ll get back to you as soon as possible.
                  </p>
                  <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="contact-name">Full name</Label>
                      <Input
                        id="contact-name"
                        {...register("name", { required: "Name is required" })}
                        placeholder="John Doe"
                        disabled={isSubmitting}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                        })}
                        placeholder="you@example.com"
                        disabled={isSubmitting}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contact-subject">Subject</Label>
                    <Input
                      id="contact-subject"
                      {...register("subject", { required: "Subject is required" })}
                      placeholder="How can we help?"
                      disabled={isSubmitting}
                      className={errors.subject ? "border-destructive" : ""}
                    />
                    {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      rows={6}
                      {...register("message", { required: "Message is required" })}
                      placeholder="Tell us more about your inquiry..."
                      disabled={isSubmitting}
                      className={cn(errors.message ? "border-destructive" : "")}
                    />
                    {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="mr-2 h-4 w-4" /> Send message</>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
