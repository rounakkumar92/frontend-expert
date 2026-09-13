"use client";

import React, { useState } from "react";
import {
  Mail,
  MessageSquare,
  FileCode,
  ShieldCheck,
  Send,
  CheckCircle2,
  HelpCircle,
  Linkedin,
  Github,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CONTACT_CHANNELS = [
  {
    icon: MessageSquare,
    title: "General & Platform Inquiries",
    description: "Questions regarding Frontend Expert, platform features, or partnerships.",
    email: "hello@frontendexpert.com",
    badge: "General",
  },
  {
    icon: FileCode,
    title: "Editorial & Errata Reports",
    description: "Found a code bug, outdated browser specification, or typo in an article?",
    email: "editorial@frontendexpert.com",
    badge: "Editorial",
  },
  {
    icon: ShieldCheck,
    title: "Security & Vulnerability Reports",
    description: "Responsible disclosure of potential vulnerabilities or auth bypass bugs.",
    email: "security@frontendexpert.com",
    badge: "Security",
  },
];

const FAQS = [
  {
    question: "How do I report a code bug or technical erratum in an article?",
    answer:
      "We take technical accuracy seriously. If you find an issue in any code snippet or benchmark, email editorial@frontendexpert.com with the article URL, code line, and your suggested correction. Our editorial team investigates and updates articles promptly with change logs.",
  },
  {
    question: "Can I suggest topics for upcoming architectural deep dives?",
    answer:
      "Yes! We regularly poll readers for upcoming research areas—such as compiler internals, WebAssembly runtimes, CSS container queries, or state machine patterns. You can submit topic requests using the contact form below.",
  },
  {
    question: "Are Frontend Expert technical articles completely free to read?",
    answer:
      "Yes, all technical articles, deep dives, benchmarks, and code snippets are 100% open and free for developers worldwide. Creating a reader account allows you to bookmark articles and customize your dashboard.",
  },
  {
    question: "How do I delete my reader account and saved data?",
    answer:
      "You have full ownership of your data. You can delete individual bookmarks directly from your Reader Dashboard. For complete account deletion and data erasure, email privacy@frontendexpert.com and your account will be removed within 24 hours.",
  },
];

export function SupportClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate clean dispatch with visual feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-16">
      {/* Contact Channels Grid */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Direct Support Desks
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Choose the dedicated team best suited for your inquiry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONTACT_CHANNELS.map((channel, idx) => {
            const Icon = channel.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card/40 p-6 glass hover:border-primary/25 hover:shadow-lg transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/15 group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                      {channel.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">
                    {channel.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {channel.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/30">
                  <a
                    href={`mailto:${channel.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline focus:outline-none"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>{channel.email}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Social & Founder Connect */}
      <section className="rounded-2xl border border-border/50 bg-card/30 p-6 sm:p-8 glass flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/rounak.png"
            alt="Rounak Kumar"
            className="h-14 w-14 rounded-2xl object-cover border-2 border-primary/30 shrink-0 shadow-md shadow-primary/10"
          />
          <div>
            <h3 className="text-base font-bold text-foreground">
              Rounak Kumar
            </h3>
            <p className="text-xs text-muted-foreground">
              Core Systems & Technical Lead — Open to architecture discussions and research feedback.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://www.linkedin.com/in/rounak-kumar-644596153/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card/60 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors focus:outline-none"
          >
            <Linkedin className="h-4 w-4 text-[#0A66C2]" />
            <span>Connect on LinkedIn</span>
          </a>
          <a
            href="https://github.com/rounakkumar92/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card/60 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors focus:outline-none"
          >
            <Github className="h-4 w-4 text-foreground" />
            <span>GitHub Profile</span>
          </a>
        </div>
      </section>

      {/* Message Form & FAQ Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Form */}
        <section className="lg:col-span-7 rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8 glass">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              Send a Message
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Have feedback, a topic suggestion, or a question? We typically respond within 24-48 business hours.
            </p>
          </div>

          {isSubmitted ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-4 animate-fade-in">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Message Received!
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out, <strong>{name || "friend"}</strong>. Our engineering desk has received your note and will review it shortly.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted transition-colors"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-semibold text-foreground">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Jane Engineer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 rounded-xl border border-border bg-background/50 px-3.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-semibold text-foreground">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="jane@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 rounded-xl border border-border bg-background/50 px-3.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-category" className="text-xs font-semibold text-foreground">
                  Inquiry Topic
                </label>
                <select
                  id="contact-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-background/50 px-3.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                >
                  <option value="general">General Inquiry / Platform Feedback</option>
                  <option value="editorial">Article Erratum or Code Correction</option>
                  <option value="topic">Topic Suggestion for Future Deep Dive</option>
                  <option value="account">Reader Account / Dashboard Support</option>
                  <option value="security">Security Vulnerability Disclosure</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-semibold text-foreground">
                  Message Details
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  placeholder="Provide context, article links, or question details..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/50 p-3.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/95 active:scale-[0.99] disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* FAQs Accordion */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/50 bg-card/30 glass overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left gap-3 focus:outline-none"
                  >
                    <span className="text-xs font-bold text-foreground">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                        isOpen && "transform rotate-180 text-primary"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
