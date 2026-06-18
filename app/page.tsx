"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, FileText, Zap, Target, Sparkles, ArrowRight } from "lucide-react";

const problems = [
  {
    icon: Search,
    title: "Too many platforms",
    desc: "LinkedIn, Indeed, Jobberman, Remotive — different tabs, different filters, same frustration every single day.",
  },
  {
    icon: FileText,
    title: "Generic CVs",
    desc: "Sending the same CV to every job means you never stand out. Each role deserves a tailored application.",
  },
  {
    icon: Zap,
    title: "No time to track",
    desc: "Applied last week? Can't remember. Interview next Tuesday? Missed it. Application tracking is a mess.",
  },
];

const solutions = [
  {
    icon: Search,
    title: "Smart Job Matching",
    desc: "Find jobs that closely match your skills and experience.",
  },
  {
    icon: FileText,
    title: "Resume Optimization",
    desc: "Tailor your resume for each application to increase interview opportunities.",
  },
  {
    icon: Zap,
    title: "Faster Applications",
    desc: "Apply to more jobs with less manual work.",
  },
];

const steps = [
  {
    num: "01",
    title: "Create an account",
    desc: "Sign up in seconds so Rolemate can personalize your job search.",
  },
  {
    num: "02",
    title: "Upload your resume",
    desc: "Add your current CV so Rolemate can analyze your skills and experience.",
  },
  {
    num: "03",
    title: "Discover matching jobs",
    desc: "See roles prioritized by fit so you focus on the best opportunities.",
  },
  {
    num: "04",
    title: "Apply with assistance",
    desc: "Save time with tailored resumes and faster application flows.",
  },
];


export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Target className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Rolemate</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2 items-center">
            <div className="text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-secondary/50 px-3 py-1 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Job search redesigned for results
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Find jobs that fit you — faster.
              </h1>

              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                Discover relevant roles, improve your resume for each application, and apply to
                more jobs with less manual work.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/jobs">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Browse Jobs
                  </Button>
                </Link>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Free to use — advanced integrations are available in Account settings.
              </p>
            </div>

            <div className="hidden md:block">
              {/* Decorative lightweight hero visual */}
              <div className="mx-auto w-full max-w-md rounded-2xl bg-card p-6 shadow">
                <div className="h-48 rounded-md bg-gradient-to-br from-primary/10 to-secondary/10" />
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="border-t bg-secondary/30 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Job hunting is exhausting
              </h2>
              <p className="mt-4 text-muted-foreground">
                You spend hours every morning doing the same repetitive tasks across multiple platforms.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {problems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="group rounded-xl border bg-card p-6 transition-colors hover:border-destructive/50"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                      <Icon className="h-6 w-6 text-destructive" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Rolemate does it for you
              </h2>
              <p className="mt-4 text-muted-foreground">
                One platform that handles your entire job search from discovery to application.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {solutions.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="group rounded-xl border bg-card p-6 transition-colors hover:border-primary/50"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="border-t bg-secondary/30 px-6 py-24">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How it works</h2>
              <p className="mt-4 text-muted-foreground">Up and running in minutes</p>
            </div>
            <div className="space-y-8">
              {steps.map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {item.num}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border bg-card p-8">
              <h3 className="text-xl font-semibold">Built for modern job seekers</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                <li className="text-sm text-muted-foreground">
                  <strong>Secure authentication</strong> — industry-standard sign-in and data protection.
                </li>
                <li className="text-sm text-muted-foreground">
                  <strong>Privacy-first</strong> — your data stays private; advanced integrations are optional.
                </li>
                <li className="text-sm text-muted-foreground">
                  <strong>AI-assisted recommendations</strong> — suggestions that help you improve outcomes.
                </li>
                <li className="text-sm text-muted-foreground">
                  <strong>Focused on results</strong> — designed to increase interview opportunities.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-secondary/30 px-6 py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Ready to find your role?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join professionals who let AI handle their job search while they focus on what matters.
            </p>
            <div className="mt-10">
              <Link href="/register">
                <Button size="lg" className="px-10 text-base">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <Target className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">Rolemate</span>
            <span className="ml-1 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/login" className="transition-colors hover:text-foreground">
              Sign In
            </Link>
            <Link href="/register" className="transition-colors hover:text-foreground">
              Sign Up
            </Link>
            <Link href="/settings" className="transition-colors hover:text-foreground">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
