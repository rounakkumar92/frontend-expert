"use client";

import React, { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="py-20 md:py-32 bg-background flex flex-col items-center justify-center flex-grow">
      <Container className="max-w-md">
        <div className="rounded-3xl border border-border/60 bg-card/30 p-8 md:p-10 text-center glass shadow-2xl relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute -left-20 -top-20 w-40 h-40 bg-destructive/10 dark:bg-destructive/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Warning Icon */}
            <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/20 mb-6 animate-pulse">
              <AlertCircle className="h-7 w-7" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-foreground mb-3">
              Something went wrong
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              An unexpected runtime error occurred on this page. We have logged this event and are investigating.
            </p>

            {/* Error Detail (collapsible/debug info in monospace) */}
            {error.message && (
              <div className="w-full text-left font-mono text-[10px] bg-muted/40 border border-border/40 p-3.5 rounded-xl text-muted-foreground/80 overflow-x-auto mb-8 whitespace-pre-wrap max-h-32">
                <strong>Error:</strong> {error.message}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3.5 w-full">
              <button
                onClick={reset}
                className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/10 hover:bg-primary/95 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Try Again</span>
              </button>
              <Link
                href="/"
                className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-card/45 px-4 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Go Home</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
