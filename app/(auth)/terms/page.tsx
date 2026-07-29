"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function TermsPage() {
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

      <h1 className="text-2xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-1 text-sm text-muted-foreground">Last updated: July 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By creating a RoleMate account, you agree to be bound by these Terms of Service.
            If you do not agree, do not use the service.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">2. Description of Service</h2>
          <p>
            RoleMate is an AI-powered job search assistant that helps users discover job listings,
            optimize resumes, and manage applications. The service is provided &ldquo;as is&rdquo; without
            guarantee of job placement or application success.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">3. User Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide accurate information when creating your profile</li>
            <li>Keep your account credentials confidential</li>
            <li>Use the service in compliance with all applicable laws</li>
            <li>Not misuse the service for spam, fraud, or unauthorized automated access</li>
            <li>Review and verify all application materials before submission</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">4. API Key Usage</h2>
          <p>
            If you provide a Groq API key, it is used solely to enable AI-powered features
            within RoleMate. Your API key is encrypted at rest. You are responsible for any
            usage charges incurred through your Groq account.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">5. Limitation of Liability</h2>
          <p>
            RoleMate and its operators are not liable for any damages arising from your use
            of the service, including but not limited to lost job opportunities, application
            errors, or data loss. The service is provided for assistance only and does not
            guarantee employment outcomes.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">6. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms
            or engage in abusive behavior. You may delete your account at any time.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">7. Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the service after changes
            constitutes acceptance of the new terms. We will notify users of material changes
            via email.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">8. Contact</h2>
          <p>
            For questions about these terms, contact us at hello@irlastudio.com.
          </p>
        </section>
      </div>
    </div>
  );
}
