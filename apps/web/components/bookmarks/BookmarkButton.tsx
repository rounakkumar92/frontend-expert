"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, BookmarkCheck, Loader2, X, Lock, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  slug: string;
  title?: string;
  className?: string;
  variant?: "icon" | "full";
}

export function BookmarkButton({
  slug,
  title = "this article",
  className,
  variant = "full",
}: BookmarkButtonProps) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);

  // Check initial bookmark status for authenticated reader
  useEffect(() => {
    if (isAuthenticated && slug) {
      let isMounted = true;
      fetch(`/api/bookmarks/check?slug=${encodeURIComponent(slug)}`)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data.bookmarked !== undefined) {
            setIsBookmarked(data.bookmarked);
          }
        })
        .catch(() => {});
      return () => {
        isMounted = false;
      };
    } else {
      setIsBookmarked(false);
    }
  }, [isAuthenticated, slug]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAuthLoading) return;

    if (!isAuthenticated) {
      setShowGuestModal(true);
      return;
    }

    setIsUpdating(true);
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    try {
      if (nextState) {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleSlug: slug }),
        });
        if (!res.ok) {
          setIsBookmarked(!nextState); // Rollback on failure
        }
      } else {
        const res = await fetch(`/api/bookmarks?slug=${encodeURIComponent(slug)}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          setIsBookmarked(!nextState); // Rollback on failure
        }
      }
    } catch {
      setIsBookmarked(!nextState);
    } finally {
      setIsUpdating(false);
    }
  };

  const returnUrl = `/blog/${slug}`;

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={handleToggle}
          disabled={isUpdating}
          aria-label={isBookmarked ? "Remove from bookmarks" : "Save article"}
          title={isBookmarked ? "Remove from bookmarks" : "Save article"}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring",
            isBookmarked
              ? "border-primary/40 bg-primary/10 text-primary shadow-sm"
              : "border-border/80 bg-card/60 text-muted-foreground hover:text-foreground hover:border-border",
            className
          )}
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isBookmarked ? (
            <BookmarkCheck className="h-4 w-4 fill-primary/20 text-primary" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      ) : (
        <button
          onClick={handleToggle}
          disabled={isUpdating}
          className={cn(
            "inline-flex h-9 items-center justify-center gap-2 rounded-xl border px-3.5 text-xs font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring",
            isBookmarked
              ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 shadow-sm"
              : "border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted/80 glass",
            className
          )}
        >
          {isUpdating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isBookmarked ? (
            <BookmarkCheck className="h-3.5 w-3.5 fill-primary/20 text-primary" />
          ) : (
            <Bookmark className="h-3.5 w-3.5" />
          )}
          <span>{isBookmarked ? "Bookmarked" : "Save Article"}</span>
        </button>
      )}

      {/* Guest Sign-in Prompt Modal */}
      {showGuestModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 dark:bg-black/75 backdrop-blur-md animate-fade-in"
          onClick={() => setShowGuestModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Sign in required to bookmark"
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-border/80 bg-card p-6 shadow-2xl backdrop-blur-xl animate-fade-in-up space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowGuestModal(false)}
              className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-2 text-center pt-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">
                Sign in to Bookmark Articles
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Save &ldquo;<span className="font-semibold text-foreground">{title}</span>&rdquo; to your personal reader dashboard to study anytime.
              </p>
            </div>

            <div className="space-y-2.5">
              <Link
                href={`/login?from=${encodeURIComponent(returnUrl)}`}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/95 transition-all"
              >
                <span>Sign In to Your Account</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href={`/signup?from=${encodeURIComponent(returnUrl)}`}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-xs font-bold text-foreground hover:bg-muted transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>Create Free Reader Account</span>
              </Link>
            </div>

            <p className="text-[10px] text-center text-muted-foreground">
              Free forever. No payment required.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
