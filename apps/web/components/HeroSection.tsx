import React from "react";
import Link from "next/link";
import { Container } from "./ui/container";
import { Terminal, Shield, ArrowDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden border-b border-border/40 bg-gradient-to-b from-background to-card/10">
      {/* Premium Minimal Background Orbs */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-accent/5 dark:bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <Container className="relative z-10 text-center">
        {/* Subtle top pill */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground glass animate-fade-in shadow-sm select-none mx-auto mb-6">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span className="h-3.5 w-px bg-border/80" />
          <span>Technical Journal for Frontend Engineers</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground sm:leading-tight max-w-4xl mx-auto">
          Deep Technical Insights for <br />
          <span className="text-primary dark:text-primary-foreground/90">
            Professional Frontend Engineers
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Breakdowns of compiler internals, rendering pipelines, state machine architectures, and advanced core web vitals performance. Strictly engineering. No fluff.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href="#featured"
            className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            Start Reading
          </Link>
          <Link
            href="#topics"
            className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card/50 px-8 text-sm font-bold text-foreground glass hover:bg-muted hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Explore Topics
          </Link>
        </div>

        {/* Scrolling helper tag */}
        <Link
          href="#featured"
          className="mt-16 md:mt-24 flex items-center justify-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 gap-1.5 hover:text-muted-foreground transition-colors duration-200 select-none group"
        >
          <span>Scroll to articles</span>
          <ArrowDown className="h-3 w-3 group-hover:translate-y-0.5 transition-transform duration-200" />
        </Link>
      </Container>
    </section>
  );
}
