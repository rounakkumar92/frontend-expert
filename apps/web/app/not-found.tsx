import React from "react";
import { Container } from "@/components/ui/container";
import { Search, Home, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 md:py-32 bg-background flex flex-col items-center justify-center flex-grow">
      <Container className="max-w-md">
        <div className="rounded-3xl border border-border/60 bg-card/30 p-8 md:p-10 text-center glass shadow-2xl relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 dark:bg-primary/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Warning Icon */}
            <div className="h-14 w-14 rounded-full bg-accent/10 text-accent flex items-center justify-center border border-accent/20 mb-6 animate-pulse">
              <HelpCircle className="h-7 w-7" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-foreground mb-3">
              Page Not Found
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              We couldn&apos;t find the page you were looking for. It might have been moved, deleted, or never existed.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3.5 w-full">
              <Link
                href="/search"
                className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/10 hover:bg-primary/95 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search Site</span>
              </Link>
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
