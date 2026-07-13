"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthContext";
import { Search, FileText, Zap, Target, Sparkles, ArrowRight, CheckCircle, Menu, X, LayoutDashboard } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Jobs", href: "/jobs" },
];

const features = [
  {
    icon: Search,
    title: "AI Job Matching",
    desc: "Find jobs that closely match your skills and experience with intelligent AI-powered recommendations.",
  },
  {
    icon: FileText,
    title: "Resume Optimization",
    desc: "Tailor your resume for each application to increase interview opportunities and stand out.",
  },
  {
    icon: Zap,
    title: "Application Automation",
    desc: "Apply to more jobs with less manual work through automated submission workflows.",
  },
  {
    icon: Target,
    title: "Job Tracking",
    desc: "Stay organized with application tracking and interview scheduling in one place.",
  },
];

const steps = [
  {
    num: "01",
    title: "Create Profile",
    desc: "Sign up in seconds so RoleMate can personalize your job search.",
  },
  {
    num: "02",
    title: "Upload Resume",
    desc: "Add your current CV so RoleMate can analyze your skills and experience.",
  },
  {
    num: "03",
    title: "Get AI Matches",
    desc: "Discover prioritized jobs that match your profile and preferences.",
  },
  {
    num: "04",
    title: "Apply Faster",
    desc: "Submit tailored applications with optimized resumes in minutes.",
  },
];

const benefits = [
  {
    icon: CheckCircle,
    title: "Save Hours Weekly",
    desc: "AI handles job search across platforms so you don't have to check multiple sites.",
  },
  {
    icon: CheckCircle,
    title: "Apply with Confidence",
    desc: "Tailored resumes and cover letters help you stand out to recruiters.",
  },
  {
    icon: CheckCircle,
    title: "Better Match Quality",
    desc: "AI-powered matching helps you focus on opportunities you'll love.",
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/assets/irla-logo.jpeg"
              alt="Irla logo"
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="text-sm font-semibold">RoleMate</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              )
            )}
            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="h-9 w-24 animate-pulse rounded-md bg-muted/50" />
              ) : isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="sm">
                    <LayoutDashboard className="mr-1.5 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Get started</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>

          <div className="md:hidden">
            {isLoading ? (
              <div className="h-9 w-9 animate-pulse rounded-md bg-muted/50" />
            ) : isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm">
                  <LayoutDashboard className="mr-1.5 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {mobileMenuOpen && !isAuthenticated && (
          <div className="border-t border-border/50 bg-background md:hidden">
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              )}
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full">Get started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-24 pb-20 sm:pt-32 sm:pb-24">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-primary/[0.03] blur-3xl" />
            <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-primary/[0.02] blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Trusted by early job seekers
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Find Better Jobs.
                <br />
                <span className="text-primary">Apply Faster</span> With AI.
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
                RoleMate helps you discover higher-fit roles, optimize your
                resume automatically, and submit more applications with ease.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {isLoading ? (
                  <div className="h-11 w-52 animate-pulse rounded-md bg-muted/50" />
                ) : isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="w-full px-8 text-base sm:w-auto"
                    >
                      <LayoutDashboard className="mr-2 h-5 w-5" />
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <Button
                        size="lg"
                        className="w-full px-8 text-base sm:w-auto"
                        aria-label="Create free account"
                      >
                        Create Free Account
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/jobs">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full px-8 text-base sm:w-auto"
                        aria-label="Browse jobs"
                      >
                        Browse Jobs
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {!isAuthenticated && (
                <p className="mt-4 text-xs text-muted-foreground/70">
                  No credit card required &middot; Private & secure
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="border-y border-border/50 bg-card py-14">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: "1,000+", label: "Jobs analyzed daily" },
                { value: "500+", label: "Applications submitted" },
                { value: "200+", label: "Resumes optimized" },
                { value: "100+", label: "Job seekers helped" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-primary sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Everything you need to land your next role
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                AI-powered tools that handle your entire job search from
                discovery to application.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="group rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how"
          className="border-y border-border/50 bg-card px-6 py-24 sm:py-28"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                How it works
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Get started in minutes with our simple four-step process.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <div key={step.num} className="relative text-center">
                  {i < steps.length - 1 && (
                    <div className="absolute left-[calc(50%+28px)] top-6 hidden h-px w-[calc(100%-56px)] bg-border/50 lg:block" />
                  )}
                  <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                    {step.num}
                  </div>
                  <h4 className="mb-2 font-semibold">{step.title}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Outcomes you can expect
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                More interviews, faster applications, and better-fit roles.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-border/50 bg-card p-8 text-center transition-all hover:border-success/20 hover:shadow-lg hover:shadow-success/5"
                  >
                    <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                      <Icon className="h-6 w-6 text-success" />
                    </div>
                    <h4 className="mb-2 text-lg font-semibold">
                      {benefit.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {benefit.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <img
              src="/assets/irla-logo.jpeg"
              alt="Irla"
              className="h-8 w-8 rounded-lg object-cover"
            />
            <div className="flex flex-col text-sm">
              <span className="font-semibold">RoleMate</span>
              <span className="text-xs text-muted-foreground">by Irla</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-foreground"
            >
              Contact
            </Link>
            <span className="text-muted-foreground/50">
              &copy; {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
