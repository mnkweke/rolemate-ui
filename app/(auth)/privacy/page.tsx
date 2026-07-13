"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function PrivacyPage() {
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

      <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-1 text-sm text-muted-foreground">Last updated: July 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">1. Information We Collect</h2>
          <p>
            When you create an account, we collect your name, email address, and a hashed password.
            If you provide a Groq API key, it is encrypted at rest and used only for AI-powered
            features (job ranking, CV optimization). We also store your resume text, profile
            preferences, job applications, and chat history to personalize your experience.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide and maintain the RoleMate service</li>
            <li>Match your profile with relevant job listings</li>
            <li>Optimize your resume for specific applications</li>
            <li>Improve our AI models and job matching algorithms</li>
            <li>Send service-related communications (password resets, etc.)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">3. Data Storage & Security</h2>
          <p>
            Your data is stored in secure PostgreSQL databases. Passwords are hashed using bcrypt.
            API keys are encrypted with Fernet (AES-128). We use HTTPS for all communications.
            We implement rate limiting and token-based authentication to protect your account.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">4. Third-Party Services</h2>
          <p>
            We integrate with Groq for LLM-powered features, Google for OAuth authentication,
            Qdrant for vector search, and various job board APIs (Remotive, Arbeitnow) to fetch
            listings. Each service processes data according to its own privacy policy.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">5. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active. You may request deletion of
            your account and associated data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">6. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal data. You may also
            export your data at any time. Contact us at privacy@rolemate.app to exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">7. Cookies</h2>
          <p>
            We use essential httpOnly cookies for authentication (access tokens and refresh tokens).
            We do not use tracking cookies or third-party analytics cookies.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">8. Contact</h2>
          <p>
            For privacy-related inquiries, contact us at privacy@rolemate.app.
          </p>
        </section>
      </div>
    </div>
  );
}
