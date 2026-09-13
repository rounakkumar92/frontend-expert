import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FileText, ArrowLeft, Code, AlertTriangle, Scale, CheckCircle2, ShieldAlert, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the terms, conditions, and licensing policies governing the use of Frontend Expert educational content and reader features.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  const lastUpdated = "September 13, 2026";

  const sections = [
    {
      icon: CheckCircle2,
      title: "1. Acceptance of Terms",
      content: (
        <div className="space-y-3">
          <p>
            By accessing, reading, or creating an account on <strong>Frontend Expert</strong> (&ldquo;the Platform&rdquo;), 
            you agree to be bound by these Terms of Service, applicable laws, and regulations. 
            If you disagree with any part of these terms, your sole recourse is to discontinue use of the platform.
          </p>
        </div>
      ),
    },
    {
      icon: Code,
      title: "2. Code Snippets & Licensing",
      content: (
        <div className="space-y-3">
          <p>
            We love open source and encourage hands-on learning. The code snippets, architecture diagrams, 
            and implementation examples published within technical articles on Frontend Expert are licensed 
            under the <strong>MIT License</strong>, unless explicitly specified otherwise.
          </p>
          <p>
            You are free to adapt, inspect, test, and integrate code patterns into your personal or commercial 
            applications with appropriate attribution. However, whole-cloth redistribution, republication, 
            or scraping of editorial prose and entire articles without prior written permission is strictly prohibited.
          </p>
        </div>
      ),
    },
    {
      icon: Scale,
      title: "3. Reader Accounts & Authentication",
      content: (
        <div className="space-y-3">
          <p>When you create an account to bookmark articles and customize your reader dashboard:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>You agree to provide accurate registration information.</li>
            <li>You are responsible for maintaining the confidentiality of your credentials and session tokens.</li>
            <li>Accounts are strictly for individual use; account sharing or credential selling is prohibited.</li>
            <li>We reserve the right to suspend or terminate accounts that engage in malicious activity, automated abuse, or security attacks.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: AlertTriangle,
      title: "4. Technical Disclaimer & Production Safety",
      content: (
        <div className="space-y-3">
          <p>
            The technical tutorials, compiler analyses, performance deep dives, and architectural specifications 
            published on Frontend Expert are provided for educational and analytical purposes &ldquo;as is&rdquo;, 
            without warranty of any kind.
          </p>
          <p>
            While our engineering desk rigorously benchmarks and reviews all content, real-world distributed systems, 
            browser runtimes, and framework versions evolve rapidly. We strongly advise validating, linting, 
            and load-testing all architectural patterns in a controlled staging environment before deploying to 
            mission-critical production environments.
          </p>
        </div>
      ),
    },
    {
      icon: ShieldAlert,
      title: "5. Prohibited Conduct",
      content: (
        <div className="space-y-3">
          <p>You agree not to engage in any of the following restricted activities:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>Attempting to probe, scan, or exploit security vulnerabilities of our authentication endpoints, API routes, or PostgreSQL infrastructure.</li>
            <li>Launching automated scrapers, crawlers, or denial-of-service (DoS) attacks that overburden server capacity.</li>
            <li>Reverse engineering or tampering with internal publisher administrative desks (`/admin`).</li>
            <li>Impersonating Frontend Expert contributors, editors, or platform staff.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: Mail,
      title: "6. Questions & Legal Notices",
      content: (
        <div className="space-y-2">
          <p>
            For legal inquiries, intellectual property notices, or terms questions, please contact our legal desk:
          </p>
          <p className="font-mono text-xs text-primary bg-primary/10 inline-block px-3 py-1.5 rounded-lg border border-primary/20">
            legal@frontendexpert.com
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
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Terms & Conditions
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Please read these terms carefully before using Frontend Expert platform features, tutorials, and reader accounts.
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
