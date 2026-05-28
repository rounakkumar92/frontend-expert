"use client";

import React, { useState } from "react";
import { Container } from "./ui/container";
import { Mail, Check, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    // Simulate a premium API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  return (
    <section className="py-16 md:py-24 border-t border-border/40 bg-gradient-to-b from-card/10 to-background/50">
      <Container>
        <div className="max-w-4xl mx-auto rounded-3xl border border-border/50 bg-card/20 p-8 sm:p-12 md:p-16 glass relative overflow-hidden shadow-xl shadow-black/[0.01]">
          {/* Subtle Accent Glow */}
          <div className="absolute -left-32 -bottom-32 w-[350px] h-[350px] bg-accent/5 dark:bg-accent/10 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -right-32 -top-32 w-[350px] h-[350px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading and Description */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-accent dark:text-accent/90">
                <Mail className="h-4 w-4" />
                <span>Weekly Technical Digest</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Join 25,000+ Frontend Leaders
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                Get our weekly breakdown of rendering internals, runtime engines, memory layout optimizations, and advanced CSS techniques. Zero marketing fluff.
              </p>
            </div>

            {/* Right Column: Subscriber Form */}
            <div className="lg:col-span-5">
              {status === "success" ? (
                <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 text-center animate-fade-in space-y-3">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <Check className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">Subscription Confirmed!</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Check your inbox next Thursday for your first deep dive resource. Welcome aboard!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative rounded-xl border border-border/80 bg-background/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background transition-all duration-200">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      placeholder="you@domain.com"
                      disabled={status === "loading"}
                      className="w-full h-11 bg-transparent px-4 text-sm outline-none text-foreground placeholder:text-muted-foreground/60"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm shadow-primary/15 hover:bg-primary/95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span>Securing Connection...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe to Digest</span>
                        <ArrowRight className="h-4 w-4 ml-1.5" />
                      </>
                    )}
                  </button>

                  {status === "error" && (
                    <p className="text-[11px] font-semibold text-destructive animate-fade-in pl-1">
                      Please enter a valid engineering email.
                    </p>
                  )}

                  <p className="text-[10px] text-muted-foreground/75 leading-normal text-center lg:text-left pl-1">
                    Strict privacy. Unsubscribe anytime with a single click.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
