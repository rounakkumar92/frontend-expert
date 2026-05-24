"use client";

import React from "react";
import { Container } from "../components/ui/container";
import { useTheme } from "next-themes";
import { CheckCircle2, Palette, Type, Terminal, ShieldCheck, Cpu } from "lucide-react";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative py-12 md:py-24 overflow-hidden flex flex-col justify-center items-center flex-grow bg-gradient-to-b from-background to-card/25">
      {/* Premium Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-accent/5 dark:bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

      <Container className="relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary animate-fade-in shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>Frontend Foundation Established Successfully</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground sm:text-7xl">
            Empower Your <br />
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-accent bg-clip-text text-transparent">
              Frontend Expertise
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The core workspace architecture for <strong>Frontend Expert</strong> has been configured with a high-end UI design system, responsive container infrastructure, Tailwind components, and advanced dark mode overrides.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/95 hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-200">
              Explore Documentation
            </button>
            <button className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-8 py-3 text-base font-semibold text-foreground hover:bg-muted hover:-translate-y-0.5 transition-all duration-200">
              View Architecture Plan
            </button>
          </div>
        </div>

        {/* Feature Grid showcasing foundation capabilities */}
        <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Card 1: Colors & Aesthetics */}
          <div className="group rounded-2xl border border-border bg-card/60 p-6 shadow-sm glass hover:shadow-md hover:border-primary/20 transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
              <Palette className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200">
              Tailwind HSL Design Tokens
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Fully customized color palettes featuring premium HSL-based brand colors, smooth mode toggling, and bespoke glassmorphism accents.
            </p>
            {/* Color preview blocks */}
            <div className="mt-4 flex gap-2">
              <div className="h-6 w-full rounded-md bg-primary shadow-sm shadow-primary/15" title="Primary" />
              <div className="h-6 w-full rounded-md bg-secondary border border-border" title="Secondary" />
              <div className="h-6 w-full rounded-md bg-accent shadow-sm shadow-accent/15" title="Accent" />
              <div className="h-6 w-full rounded-md bg-muted" title="Muted" />
              <div className="h-6 w-full rounded-md bg-destructive" title="Destructive" />
            </div>
          </div>

          {/* Card 2: Layout & Typography */}
          <div className="group rounded-2xl border border-border bg-card/60 p-6 shadow-sm glass hover:shadow-md hover:border-primary/20 transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform duration-300">
              <Type className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-accent transition-colors duration-200">
              Geist Typography System
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Integrated local Geist Sans for headlines and body text, and Geist Mono for code structures, matching the coding-standards guidelines.
            </p>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Font Preview</div>
              <div className="font-sans text-xs font-bold text-foreground">Geist Sans Heading</div>
              <div className="font-mono text-[10px] text-accent">geist-mono: const x = 42;</div>
            </div>
          </div>

          {/* Card 3: System Status & Infrastructure */}
          <div className="group rounded-2xl border border-border bg-card/60 p-6 shadow-sm glass hover:shadow-md hover:border-primary/20 transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200">
              Active Environment Config
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Fully optimized with React 19 concurrent features, TypeScript strict typing, and Next.js 15+ App Routing.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs p-3 bg-muted/50 rounded-lg border border-border">
              <span className="font-medium">Active Theme:</span>
              <span className="font-bold text-primary capitalize">
                {mounted ? theme || "system" : "detecting..."}
              </span>
            </div>
          </div>
        </div>

        {/* Tech checklist panel */}
        <div className="mt-16 md:mt-24 max-w-xl mx-auto border border-border bg-card/40 rounded-2xl p-6 glass">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            Workspace Checklist Status
          </h3>
          <div className="space-y-3">
            {[
              "Tailwind CSS v3 architecture configured",
              "shadcn/ui layout mapping initialized",
              "Dark/Light ThemeProvider with System Overrides integration",
              "Fluid micro-animations & layout framework header/footer",
              "Flexible responsive container padding constraints",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
