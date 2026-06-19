"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Sparkles, CheckCircle } from "lucide-react";

const features = [
  "AI Job Matching",
  "Resume Optimization",
  "One-click Applications",
  "Application Tracking",
];

function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-[60%] flex-col justify-between border-r border-border/50 bg-card p-12">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/assets/irla-logo.jpeg"
              alt="Irla logo"
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="text-sm font-semibold">RoleMate</span>
          </Link>
        </div>

        <div className="max-w-md">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered job assistant
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find Better Jobs.
            <br />
            <span className="text-primary">Apply Faster</span> With AI.
          </h1>

          <ul className="mt-8 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 shrink-0 text-success" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} RoleMate by Irla
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}
