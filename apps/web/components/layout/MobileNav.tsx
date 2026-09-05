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
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, slugify } from "@/lib/utils";
import { MOCK_TRENDING_TAGS } from "@/lib/mock-data";
import { useAuth } from "@/components/auth/AuthProvider";

const POPULAR_TAGS = MOCK_TRENDING_TAGS.slice(0, 8);

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const toggleButtonRef = React.useRef<HTMLButtonElement>(null);
  const { user, isAuthenticated, logout } = useAuth();

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

  const navItems = [
    {
      label: "Articles",
      description: "In-depth technical deep dives and analysis",
      href: "/blog",
      icon: BookOpen,
    },
    ...(isAuthenticated
      ? [
          {
            label: "Dashboard",
            description: "Your saved articles and reader profile",
            href: "/dashboard",
            icon: LayoutDashboard,
          },
        ]
      : []),
    {
      label: "Categories",
      description: "Browse articles by domain and topic area",
      href: "/categories",
      icon: Layers,
    },
    {
      label: "Tags",
      description: "Explore the full topic and technology index",
      href: "/tags",
      icon: Tag,
    },
  ];

  const overlay = (
    <div className="fixed inset-0 z-40 md:hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Full-height Panel below sticky header */}
      <div className="fixed top-14 left-0 right-0 bottom-0 bg-background/98 dark:bg-background/[0.99] backdrop-blur-2xl border-t border-border/40 overflow-y-auto animate-slide-down">
        <div className="flex flex-col min-h-full">
          {/* Main content */}
          <div className="flex-1 px-5 py-6 space-y-6">
            {/* Navigation Items — Full-width vertical list */}
            <nav className="space-y-1.5" aria-label="Mobile navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring active:scale-[0.98]",
                      isActive
                        ? "border-primary/50 bg-primary/10 shadow-sm"
                        : "border-border/50 bg-card/40 hover:border-primary/30 hover:bg-muted/50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl shrink-0 transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted/80 text-muted-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "text-sm font-bold leading-tight",
                          isActive ? "text-primary" : "text-foreground"
                        )}
                      >
                        {item.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground/80 mt-0.5 leading-snug">
                        {item.description}
                      </div>
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground/40"
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Trending Topics */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                <Sparkles className="h-3 w-3 text-primary" />
                <span>Trending Topics</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${slugify(tag)}`}
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center rounded-lg border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-muted transition-colors active:scale-95"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Sticky Section — User Card + CTAs */}
          <div className="sticky bottom-0 border-t border-border/40 bg-background/95 dark:bg-background/98 backdrop-blur-xl px-5 py-5 space-y-4">
            {/* User Account / Author Spotlight Card */}
            {isAuthenticated && user ? (
              <div className="rounded-xl border border-primary/25 bg-primary/5 p-3.5 flex items-center justify-between glass">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-foreground truncate">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                      <UserIcon className="h-3 w-3" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors shrink-0"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-border/60 bg-card/40 p-3.5 flex items-center justify-between glass">
                <div className="flex items-center gap-3 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/rounak.png"
                    alt="Rounak Kumar"
                    className="h-10 w-10 rounded-full object-cover border border-primary/30 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-foreground truncate">
                      Rounak Kumar
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      Core Systems Engineer
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href="https://www.linkedin.com/in/rounak-kumar-644596153/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn Profile"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-[#0A66C2] transition-colors focus:outline-none"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="https://github.com/rounakkumar92/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub Profile"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Action CTAs */}
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/95 active:scale-[0.99] transition-all"
              >
                <span>Go to Reader Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex h-12 w-full items-center justify-center rounded-xl border border-border bg-card text-sm font-bold text-foreground hover:bg-muted transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/95 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
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
