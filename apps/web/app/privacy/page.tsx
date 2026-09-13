import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ShieldCheck, ArrowLeft, Lock, Database, Eye, Cookie, UserCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Frontend Expert protects your data, respects your privacy, and safeguards your reader account.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  const lastUpdated = "September 13, 2026";

  const sections = [
    {
      icon: ShieldCheck,
      title: "1. Core Privacy Philosophy",
      content: (
        <div className="space-y-3">
          <p>
            At <strong>Frontend Expert</strong>, we believe engineering publications should respect reader privacy. 
            We do not sell, rent, or monetize your personal information. We do not embed invasive cross-site advertising 
            trackers or third-party behavioral telemetry brokers.
          </p>
          <p>
            Our infrastructure is built strictly to deliver high-quality technical documentation, deep architectural 
            analysis, and personalized reader workflows (such as bookmarks and reading history).
          </p>
        </div>
      ),
    },
    {
      icon: Database,
      title: "2. Information We Collect",
      content: (
        <div className="space-y-3">
          <p>We collect only the minimal data required to provide platform functionality:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Reader Accounts:</strong> When you register an account, we collect your 
              name, email address, and a cryptographically hashed representation of your password (salted using bcrypt with cost factor 10). 
              We never store or have access to plaintext passwords.
            </li>
            <li>
              <strong className="text-foreground">Personalization Data:</strong> When authenticated, articles you choose to bookmark 
              are linked to your reader profile in our relational database to sync across your sessions.
            </li>
            <li>
              <strong className="text-foreground">Optional Newsletter:</strong> If you voluntarily subscribe to our weekly technical digest, 
              we store your email solely for dispatching editorial updates. You can unsubscribe at any time with a single click.
            </li>
            <li>
              <strong className="text-foreground">Operational Logs:</strong> Standard HTTP server logs (IP address, user agent, requested URL, 
              and response status) are retained temporarily for cybersecurity, DDoS mitigation, and error diagnostics.
            </li>
          </ul>
        </div>
      ),
    },
    {
      icon: Cookie,
      title: "3. Cookies & Session Management",
      content: (
        <div className="space-y-3">
          <p>
            Frontend Expert uses strictly necessary first-party cookies for security and session state:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">__session</code>: 
              An HTTP-only, secure, SameSite-protected JWT token used to maintain your authenticated reader or administrator session.
            </li>
            <li>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">theme</code>: 
              A client-side preference cookie or local storage value tracking whether you prefer dark mode or light mode.
            </li>
          </ul>
          <p>
            We do not use advertising or cross-site tracking cookies.
          </p>
        </div>
      ),
    },
    {
      icon: Lock,
      title: "4. Security & Data Storage",
      content: (
        <div className="space-y-3">
          <p>
            All network communication with Frontend Expert is enforced over Transport Layer Security (TLS 1.3 / HTTPS) 
            with Strict-Transport-Security (HSTS) headers enabled.
          </p>
          <p>
            Authentication utilizes HMAC-SHA256 encrypted session tokens, timing-safe credential verification, 
            and server-side rate limiting to protect endpoints against credential stuffing and brute-force attacks.
          </p>
        </div>
      ),
    },
    {
      icon: UserCheck,
      title: "5. Your Rights & Data Erasure (GDPR & CCPA)",
      content: (
        <div className="space-y-3">
          <p>
            Regardless of your geographical jurisdiction, you possess full ownership over your personal data:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li><strong>Right to Access:</strong> You can inspect your profile data and saved bookmarks directly in your reader dashboard.</li>
            <li><strong>Right to Rectification:</strong> You can update your profile details at any time.</li>
            <li><strong>Right to Erasure (Forget Me):</strong> You can request complete deletion of your account, saved bookmarks, and associated records.</li>
            <li><strong>Right to Portability:</strong> You may request an export of your account data and bookmarked references in structured JSON format.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: Mail,
      title: "6. Contacting Us",
      content: (
        <div className="space-y-2">
          <p>
            If you have questions regarding this Privacy Policy or wish to exercise your data rights, please contact our 
            engineering and privacy desk:
          </p>
          <p className="font-mono text-xs text-primary bg-primary/10 inline-block px-3 py-1.5 rounded-lg border border-primary/20">
            privacy@frontendexpert.com
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="py-12 sm:py-16 md:py-20 bg-background">
      <Container>
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-foreground mb-8 group transition-colors duration-150 focus:outline-none"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform duration-150" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <div className="flex items-center gap-2.5 mb-2.5">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Legal & Transparency
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            We respect your privacy as a developer. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground/75 font-mono">
            <span>Last updated:</span>
            <span className="text-foreground font-semibold">{lastUpdated}</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl space-y-8">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border/50 bg-card/40 p-6 sm:p-8 glass transition-all duration-200 hover:border-primary/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/15 shrink-0">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">
                    {section.title}
                  </h2>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed pl-0 sm:pl-12">
                  {section.content}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
