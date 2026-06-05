"use client";

import React, { useEffect, useState, useRef } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";
import { slugify } from "./MDXRenderer";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  content: string;
}

interface HeadingItem {
  id: string;
  text: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 1. Parse headings from markdown content
  useEffect(() => {
    const lines = content.split("\n");
    const foundHeadings: HeadingItem[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
        const text = trimmed.substring(3).trim();
        foundHeadings.push({
          id: slugify(text),
          text,
        });
      }
    });

    setHeadings(foundHeadings);
  }, [content]);

  // 2. Set up IntersectionObserver to track visible sections
  useEffect(() => {
    if (headings.length === 0) return;

    if (observerRef.current) observerRef.current.disconnect();

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Find headings crossing the top of the viewport
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // Highlight the top-most visible heading
        const sorted = visibleEntries.sort(
          (a, b) =>
            a.target.getBoundingClientRect().top -
            b.target.getBoundingClientRect().top
        );
        const top = sorted[0];
        if (top) setActiveId(top.target.id);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: "-80px 0px -60% 0px", // Offset for sticky header
      threshold: 0.1,
    });

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  const handleScrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 88; // Sticky navigation height + small margin
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      
      // Manually set active state in case scroll doesn't trigger observer immediately
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="w-full" aria-label="Table of contents">
      {/* A. Mobile Collapsible Dropdown Widget */}
      <div className="block lg:hidden border border-border/50 rounded-xl bg-card/40 p-4 glass mb-6">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-toc-list"
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-foreground/80 focus:outline-none"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4 text-primary" />
            <span>Table of Contents</span>
          </span>
          {mobileOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {mobileOpen && (
          <ul id="mobile-toc-list" className="mt-4 border-t border-border/30 pt-3.5 space-y-3 pl-1.5 animate-fade-in">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleScrollTo(heading.id, e)}
                  className={cn(
                    "block text-xs font-semibold leading-relaxed transition-colors duration-150",
                    activeId === heading.id
                      ? "text-primary dark:text-primary-foreground/90 font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* B. Desktop Static Sidebar List */}
      <div className="hidden lg:block space-y-3.5 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 select-none">
        <h4 className="font-bold text-[10px] tracking-widest uppercase text-foreground/80 flex items-center gap-2 mb-4">
          <List className="h-3.5 w-3.5 text-primary" />
          <span>In This Article</span>
        </h4>
        
        <ul className="space-y-3 border-l border-border/60 pl-4 font-medium text-xs">
          {headings.map((heading) => (
            <li key={heading.id} className="relative">
              {/* Active Bullet Indicator */}
              {activeId === heading.id && (
                <div className="absolute -left-[18.5px] top-1/2 -translate-y-1/2 h-3.5 w-[3px] rounded-r bg-primary shadow-sm shadow-primary/40 animate-fade-in" />
              )}
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleScrollTo(heading.id, e)}
                className={cn(
                  "block leading-relaxed transition-all duration-200 py-0.5",
                  activeId === heading.id
                    ? "text-primary dark:text-primary-foreground/90 font-extrabold translate-x-0.5"
                    : "text-muted-foreground hover:text-foreground hover:translate-x-0.5"
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
