import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Headphones, ArrowLeft } from "lucide-react";
import { SupportClient } from "./SupportClient";

export const metadata: Metadata = {
  title: "Support Contacts & Community",
  description:
    "Get in touch with the Frontend Expert engineering desk for technical feedback, errata reporting, or reader support.",
  alternates: {
    canonical: "/support",
  },
};

export default function SupportPage() {
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
            <Headphones className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Communications Desk
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Support Contacts & Feedback
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Have questions about modern frontend architectures, found an erratum in our deep dives, or need reader assistance? We&apos;re here to help.
          </p>
        </div>

        {/* Client Interactive Section */}
        <SupportClient />
      </Container>
    </div>
  );
}
