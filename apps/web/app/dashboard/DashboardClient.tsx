"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  BookmarkX,
  LogOut,
  User as UserIcon,
  ArrowRight,
  Clock,
  Calendar,
  Sparkles,
  Layers,
  Trash2,
  Loader2,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { useAuth, UserSession } from "@/components/auth/AuthProvider";

export interface BookmarkedArticleItem {
  id: string;
  articleSlug: string;
  createdAt: string | Date;
  article: {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    readTime: string;
    publishedAt: string;
    author: {
      name: string;
      avatarUrl?: string;
    };
  } | null;
}

interface DashboardClientProps {
  initialUser: UserSession;
  initialBookmarks: BookmarkedArticleItem[];
}

export function DashboardClient({ initialUser, initialBookmarks }: DashboardClientProps) {
  const { logout } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkedArticleItem[]>(initialBookmarks);
  const [removingSlug, setRemovingSlug] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleRemoveBookmark = async (articleSlug: string) => {
    setRemovingSlug(articleSlug);
    try {
      const res = await fetch(`/api/bookmarks?slug=${encodeURIComponent(articleSlug)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBookmarks((prev) => prev.filter((b) => b.articleSlug !== articleSlug));
      }
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    } finally {
      setRemovingSlug(null);
    }
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <div className="py-10 md:py-16 bg-background flex-grow">
      <Container className="max-w-5xl space-y-10">
        {/* 1. Header Profile Banner */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-6 md:p-8 backdrop-blur-md glass shadow-sm relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner font-extrabold text-xl">
                {initialUser.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={initialUser.avatarUrl}
                    alt={initialUser.name}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  initialUser.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
                    {initialUser.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3 w-3" />
                    <span>{initialUser.role.toLowerCase()}</span>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>{initialUser.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={handleSignOut}
                disabled={isLoggingOut}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-xs font-semibold text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LogOut className="h-3.5 w-3.5" />
                )}
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Bookmarked Articles Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-primary" />
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
                  Saved Technical Articles
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Articles you have bookmarked for offline study and quick reference.
              </p>
            </div>

            <span className="inline-flex h-6 items-center justify-center rounded-full bg-muted/60 px-3 text-xs font-semibold text-muted-foreground self-start sm:self-auto">
              {bookmarks.length} {bookmarks.length === 1 ? "saved article" : "saved articles"}
            </span>
          </div>

          {/* Bookmarks List */}
          {bookmarks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {bookmarks.map((b) => {
                if (!b.article) {
                  return (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-border/60 bg-card/40 p-5 flex items-center justify-between"
                    >
                      <div className="text-xs text-muted-foreground">
                        Article ({b.articleSlug}) is no longer available.
                      </div>
                      <button
                        onClick={() => handleRemoveBookmark(b.articleSlug)}
                        className="text-xs text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                }

                const { title, slug, excerpt, category, readTime, publishedAt } =
                  b.article;

                return (
                  <div
                    key={b.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/40 p-5 md:p-6 glass hover:border-primary/30 hover:bg-muted/40 transition-all duration-200 animate-fade-in shadow-sm"
                  >
                    <div className="space-y-3">
                      {/* Top Category and remove button */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
                          <Layers className="h-3 w-3" />
                          <span>{category}</span>
                        </span>

                        <button
                          onClick={() => handleRemoveBookmark(slug)}
                          disabled={removingSlug === slug}
                          aria-label={`Remove ${title} from bookmarks`}
                          title="Remove bookmark"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-transparent text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                          {removingSlug === slug ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Title */}
                      <Link
                        href={`/blog/${slug}`}
                        className="block focus:outline-none"
                      >
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {title}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 font-normal">
                        {excerpt}
                      </p>
                    </div>

                    {/* Bottom Metadata & CTA */}
                    <div className="border-t border-border/40 pt-4 mt-5 flex items-center justify-between text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{readTime}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{publishedAt}</span>
                        </span>
                      </div>

                      <Link
                        href={`/blog/${slug}`}
                        className="font-bold text-primary hover:underline inline-flex items-center gap-1 group/btn"
                      >
                        <span>Read</span>
                        <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 bg-card/20 p-12 text-center space-y-4 animate-fade-in">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <BookmarkX className="h-6 w-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-sm font-bold text-foreground">No saved articles yet</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  As you browse deep technical breakdowns, click the bookmark icon on any article to save it to your dashboard.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/blog"
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/15 hover:bg-primary/95 transition-all"
                >
                  <span>Explore Technical Articles</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
