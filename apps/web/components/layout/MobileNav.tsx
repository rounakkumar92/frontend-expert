"use client";

import React from "react";
import { createPortal } from "react-dom";
import {
  Menu,
  X,
  BookOpen,
  Layers,
  Tag,
  ArrowRight,
  Linkedin,
  Github,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, slugify } from "@/lib/utils";
import { MOCK_TRENDING_TAGS } from "@/lib/mock-data";

const NAV_TILES = [
  {
    label: "Articles",
    description: "Deep dive analyses",
    href: "/blog",
    icon: BookOpen,
  },
  {
    label: "Categories",
    description: "Browse by domain",
    href: "/categories",
    icon: Layers,
  },
  {
    label: "Tags",
    description: "Topic index",
    href: "/tags",
    icon: Tag,
  },
];

const POPULAR_TAGS = MOCK_TRENDING_TAGS.slice(0, 6);

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const toggleButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close when pathname changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle escape key & lock background scroll
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          setIsOpen(false);
          toggleButtonRef.current?.focus();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "unset";
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const overlay = (
    <div className="fixed inset-0 z-40 md:hidden animate-fade-in">
      {/* Backdrop — tapping outside closes the menu */}
      <div
        className="fixed inset-0 bg-background/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-down Panel anchored immediately below sticky header (top-14) */}
      <div className="relative top-14 mx-auto w-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border/80 bg-background/95 dark:bg-background/98 backdrop-blur-2xl shadow-2xl transition-all duration-300 animate-slide-down">
        <div className="px-4 py-5 sm:px-6 space-y-4">
          {/* Primary Nav Tiles */}
          <div className="grid grid-cols-3 gap-2">
            {NAV_TILES.map((tile) => {
              const Icon = tile.icon;
              const isActive = pathname === tile.href;
              return (
                <Link
                  key={tile.href}
                  href={tile.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex flex-col items-center text-center p-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring active:scale-95",
                    isActive
                      ? "border-primary/50 bg-primary/10 text-primary shadow-sm"
                      : "border-border/60 bg-card/60 text-foreground hover:border-primary/30 hover:bg-muted/60"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg mb-1.5 transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/80 text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold leading-tight">{tile.label}</span>
                  <span className="text-[9px] text-muted-foreground/80 mt-0.5 leading-tight">
                    {tile.description}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Trending Topics Pills */}
          <div className="space-y-2 border-t border-border/40 pt-3.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-0.5">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Trending Topics</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TAGS.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${slugify(tag)}`}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center rounded-lg border border-border/60 bg-card/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-muted transition-colors active:scale-95"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Author Card Spotlight */}
          <div className="rounded-xl border border-border/60 bg-card/40 p-3 flex items-center justify-between glass">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/rounak.png"
                alt="Rounak Kumar"
                className="h-8 w-8 rounded-full object-cover border border-primary/30 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-foreground truncate">Rounak Kumar</div>
                <div className="text-[10px] text-muted-foreground truncate">Core Systems Engineer</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href="https://www.linkedin.com/in/rounak-kumar-644596153/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-[#0A66C2] transition-colors focus:outline-none"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://github.com/rounakkumar92/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/blog"
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/95 active:scale-[0.99] transition-all"
          >
            <span>Explore All Technical Articles</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex md:hidden items-center">
      <button
        ref={toggleButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-card text-foreground hover:bg-muted hover:text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        aria-expanded={isOpen}
        aria-label="Toggle Menu"
      >
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <X className="h-4.5 w-4.5 transition-all duration-200 rotate-90 scale-100" />
        ) : (
          <Menu className="h-4.5 w-4.5 transition-all duration-200 scale-100" />
        )}
      </button>

      {/* Render via Portal so it smoothly drops below sticky header */}
      {isOpen && mounted && createPortal(overlay, document.body)}
    </div>
  );
}
