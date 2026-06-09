"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Search,
  FileText,
  Send,
  ChevronRight,
  Brain,
  Target,
  Zap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

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
    icon: Send,
    title: "No time to track",
    desc: "Applied last week? Can't remember. Interview next Tuesday? Missed it. Application tracking is a mess.",
  },
];

const solutions = [
  {
    icon: Brain,
    title: "AI Job Discovery",
    desc: "Aggregates listings from multiple job boards. Ranks each role against your profile with recruiter-style AI reasoning so you see only the best matches.",
  },
  {
    icon: FileText,
    title: "CV Optimization",
    desc: "Upload your CV once. For each application, Rolemate rewrites your summary and skills to match that specific role — then exports a clean PDF.",
  },
  {
    icon: Send,
    title: "Auto-Apply Agent",
    desc: "Select the jobs you want. Rolemate opens the application, fills the form, uploads your optimized CV, and submits — all automatically.",
  },
];

const steps = [
  {
    num: "01",
    title: "Upload your CV",
    desc: "Rolemate extracts your skills, experience, and preferences automatically. No manual setup needed.",
  },
  {
    num: "02",
    title: "Add your Groq API key",
    desc: "Get a free key from console.groq.com. This powers AI ranking and CV optimization.",
  },
  {
    num: "03",
    title: "Get matched jobs",
    desc: "Rolemate scrapes fresh jobs daily and ranks the best matches for your profile with detailed explanations.",
  },
  {
    num: "04",
    title: "Apply with one click",
    desc: "Select the jobs you want. Rolemate optimizes your CV for each one and submits automatically.",
  },
];

const apiSteps = [
  {
    num: "1",
    title: "Visit Groq Console",
    desc: "Go to console.groq.com and sign up for free.",
  },
  {
    num: "2",
    title: "Create an API key",
    desc: "Navigate to API Keys and generate a new key.",
  },
  {
    num: "3",
    title: "Paste in Rolemate",
    desc: "Copy the key and paste it during signup or in Settings.",
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
        <section className="px-6 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              AI-Powered Job Search Agent
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Find Your Perfect
              <span className="mt-2 block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Role with AI
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Rolemate aggregates jobs from across Nigeria and globally, ranks them against your
              profile using AI, optimizes your CV per application, and applies for you — automatically.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Free to use. Bring your own Groq API key for AI features.
            </p>
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

        {/* Groq API Key Section */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border bg-card p-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Bring your own AI</h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Rolemate uses Groq&apos;s lightning-fast AI for job ranking and CV optimization.
                You need a free Groq API key to unlock these features.
              </p>
              <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
                {apiSteps.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl border bg-secondary/30 p-4 text-left"
                  >
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {item.num}
                    </div>
                    <h4 className="mb-1 text-sm font-semibold">{item.title}</h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <a
                  href="https://console.groq.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg">
                    Get Free Groq API Key
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
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
            <a
              href="https://console.groq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Get API Key
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
