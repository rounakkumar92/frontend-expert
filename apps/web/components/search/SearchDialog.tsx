"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Command, CornerDownLeft, ArrowUpDown, Clock, History, FileText, Trash2 } from "lucide-react";
import { Article } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { Highlight } from "./Highlight";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Fetch search index dynamically on open/focus
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch("/api/search")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setArticles(data);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load search index", err);
          setIsLoading(false);
        });

      // Load recent searches from localStorage
      try {
        const history = localStorage.getItem("fe-recent-searches");
        if (history) {
          setRecentSearches(JSON.parse(history));
        }
      } catch (err) {
        console.error("Failed to read recent searches", err);
      }

      // Focus input
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setActiveIndex(0);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 2. Local search scoring/filtering
  const getFilteredArticles = () => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    return articles.filter((article) => {
      const matchTitle = article.title.toLowerCase().includes(trimmed);
      const matchExcerpt = article.excerpt.toLowerCase().includes(trimmed);
      const matchCategory = article.category.toLowerCase().includes(trimmed);
      const matchTags = article.tags.some((tag) => tag.toLowerCase().includes(trimmed));
      return matchTitle || matchExcerpt || matchCategory || matchTags;
    });
  };

  const filtered = getFilteredArticles();

  // Reset active index on query change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // 3. Save searches in localStorage
  const saveSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item !== trimmed);
      const next = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem("fe-recent-searches", JSON.stringify(next));
      return next;
    });
  };

  const clearRecentSearches = () => {
    localStorage.removeItem("fe-recent-searches");
    setRecentSearches([]);
  };

  // 4. Keyboard controls inside search palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0));
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (filtered.length > 0 && filtered[activeIndex]) {
          const target = filtered[activeIndex];
          saveSearch(query);
          router.push(`/blog/${target.slug}`);
          onClose();
        } else if (query.trim()) {
          saveSearch(query);
          router.push(`/search?q=${encodeURIComponent(query.trim())}`);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, activeIndex, query, router, onClose]);

  // 5. Click outside backdrop to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-background/50 dark:bg-black/60 backdrop-blur-md transition-all duration-300 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl border border-border/60 bg-card/85 dark:bg-card/40 rounded-2xl glass shadow-2xl overflow-hidden flex flex-col max-h-[60vh] animate-scale-up">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50 bg-muted/20">
          <Search className="h-5 w-5 text-muted-foreground/80 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search all publications, tags, and categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none border-none focus:ring-0 w-full"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all shrink-0"
              aria-label="Clear query"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground border border-border/60 px-2 py-1 rounded bg-background shrink-0 select-none hidden sm:block"
          >
            Esc
          </button>
        </div>

        {/* Results / List Area */}
        <div className="flex-grow overflow-y-auto p-4 space-y-2.5 min-h-[150px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-muted-foreground">Indexing publications...</p>
            </div>
          ) : query.trim() === "" ? (
            /* Empty input view: Show recent searches & navigation shortcuts */
            <div className="space-y-6 py-2">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <History className="h-3.5 w-3.5" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-muted-foreground/60 hover:text-destructive flex items-center gap-1 transition-colors duration-150"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(search)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-150"
                      >
                        <Clock className="h-3 w-3 text-muted-foreground/60" />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Navigation Help */}
              <div>
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Command className="h-3.5 w-3.5 text-primary" />
                  <span>Popular Hotkeys</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between p-2 rounded-lg border border-border/30 bg-muted/10">
                    <span>Explore Blog Catalog</span>
                    <kbd className="px-1.5 py-0.5 rounded border border-border/60 bg-background text-[10px] font-mono shadow-sm">G + B</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg border border-border/30 bg-muted/10">
                    <span>Trigger Search Console</span>
                    <kbd className="px-1.5 py-0.5 rounded border border-border/60 bg-background text-[10px] font-mono shadow-sm">⌘K / ⌃K</kbd>
                  </div>
                </div>
              </div>
            </div>
          ) : filtered.length > 0 ? (
            /* Results found rendering */
            filtered.map((article, idx) => (
              <div
                key={article.id}
                onClick={() => {
                  saveSearch(query);
                  router.push(`/blog/${article.slug}`);
                  onClose();
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  idx === activeIndex
                    ? "border-primary bg-primary/[0.03] shadow-md shadow-primary/[0.01]"
                    : "border-border/30 bg-muted/5 hover:bg-muted/10 hover:border-border/60"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <FileText className={`h-4 w-4 mt-0.5 shrink-0 transition-colors duration-150 ${
                    idx === activeIndex ? "text-primary" : "text-muted-foreground/60"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-muted-foreground/90 uppercase tracking-wide mb-0.5">
                      {article.category}
                    </div>
                    <div className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors duration-150">
                      <Highlight text={article.title} query={query} />
                    </div>
                    <div className="text-xs text-muted-foreground/80 truncate mt-0.5">
                      <Highlight text={article.excerpt} query={query} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pl-3">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 border border-border px-1.5 py-0.5 rounded">
                    Open
                  </span>
                  <CornerDownLeft className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    idx === activeIndex ? "translate-x-0.5 text-primary" : "text-muted-foreground/40"
                  }`} />
                </div>
              </div>
            ))
          ) : (
            /* No results matched view */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-10 w-10 rounded-full bg-muted/30 border border-border/40 flex items-center justify-center text-muted-foreground mb-4">
                <Search className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">No publications found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mt-1.5 leading-relaxed">
                We couldn&apos;t find any deep dives matching &ldquo;{query}&rdquo;. Check spelling, try tags, or explore categories.
              </p>
            </div>
          )}
        </div>

        {/* Hotkeys Footer Panel */}
        <div className="px-4 py-2.5 bg-muted/30 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground font-mono select-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded border bg-background text-[9px]">Enter</kbd>
              <span>Select</span>
            </span>
          </div>
          <div>
            <span>Search console v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
