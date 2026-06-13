"use client";

import React, { useState, useEffect } from "react";
import { Link2, Twitter, Linkedin, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareActionsProps {
  title: string;
  slug: string;
}

export function ShareActions({ title, slug }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://frontendexpert.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const getFullUrl = () => {
    return `${origin}/blog/${slug}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getFullUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Check out: "${title}" on Frontend Expert! \n\n`
  )}&url=${encodeURIComponent(getFullUrl())}`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    getFullUrl()
  )}`;

  return (
    <div className="flex flex-row lg:flex-col items-center lg:items-start gap-3 select-none">
      <h4 className="hidden lg:block font-bold text-[10px] tracking-widest uppercase text-foreground/80 mb-2">
        Share Article
      </h4>
      
      <div className="flex flex-row lg:flex-col gap-2.5">
        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copy article link to clipboard"
          className="flex h-9 w-9 lg:w-auto lg:h-9 lg:px-3.5 items-center justify-center rounded-xl border border-border bg-card/40 glass text-muted-foreground hover:text-foreground hover:bg-muted hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 gap-2 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-accent animate-fade-in" />
              <span className="hidden lg:inline text-xs text-accent font-semibold animate-fade-in">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              <span className="hidden lg:inline text-xs font-semibold">Copy Link</span>
            </>
          )}
        </button>

        {/* Twitter Share */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share this article on X"
          className="flex h-9 w-9 lg:w-auto lg:h-9 lg:px-3.5 items-center justify-center rounded-xl border border-border bg-card/40 glass text-muted-foreground hover:text-foreground hover:bg-muted hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 gap-2 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <Twitter className="h-4 w-4" />
          <span className="hidden lg:inline text-xs font-semibold">Share on X</span>
        </a>

        {/* LinkedIn Share */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share this article on LinkedIn"
          className="flex h-9 w-9 lg:w-auto lg:h-9 lg:px-3.5 items-center justify-center rounded-xl border border-border bg-card/40 glass text-muted-foreground hover:text-foreground hover:bg-muted hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 gap-2 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <Linkedin className="h-4 w-4" />
          <span className="hidden lg:inline text-xs font-semibold">Post on LinkedIn</span>
        </a>
      </div>
    </div>
  );
}
