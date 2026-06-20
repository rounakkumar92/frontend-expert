"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Search, X, ArrowLeft, History, FolderOpen, Tag, Trash2, ArrowRight } from "lucide-react";
import { Article } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { SearchResultCard } from "@/components/search/SearchResultCard";

interface SearchPageClientProps {
  initialArticles: Article[];
}

export function SearchPageClient({ initialArticles }: SearchPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(defaultQuery);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // 1. Sync local search query with URL search parameters
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  // Load search history from localStorage on client render
  useEffect(() => {
    try {
      const history = localStorage.getItem("fe-recent-searches");
      if (history) {
        setRecentSearches(JSON.parse(history));
      }
    } catch (err) {
      console.error("Failed to load search history", err);
    }
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    const params = new URLSearchParams();
    if (val.trim()) {
      params.set("q", val);
    }
    router.replace(`/search?${params.toString()}`, { scroll: false });
  };

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

  const handleSelectResult = () => {
    saveSearch(query);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem("fe-recent-searches");
    setRecentSearches([]);
  };

  // 2. Perform search matches across Title, Excerpt, Category, and Tags
  const getFilteredArticles = () => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    return initialArticles.filter((article) => {
      const matchTitle = article.title.toLowerCase().includes(trimmed);
      const matchExcerpt = article.excerpt.toLowerCase().includes(trimmed);
      const matchCategory = article.category.toLowerCase().includes(trimmed);
      const matchTags = article.tags.some((tag) => tag.toLowerCase().includes(trimmed));
      return matchTitle || matchExcerpt || matchCategory || matchTags;
    });
  };

  const filtered = getFilteredArticles();

  // Extract unique popular categories and tags for quick explore widgets
  const categories = Array.from(new Set(initialArticles.map((a) => a.category))).slice(0, 5);
  const tags = Array.from(new Set(initialArticles.flatMap((a) => a.tags))).slice(0, 8);

  return (
    <div className="py-12 sm:py-16 md:py-20 bg-background min-h-screen">
      <Container>
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-foreground mb-8 group transition-colors duration-150 focus:outline-none"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform duration-150" />
          <span>Back to Blog</span>
        </Link>

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary/95 dark:text-primary/90">
            Search Engine
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Explore Publications
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Search through deep-dives, systems designs, React logs, and performance audits instantly.
          </p>
        </div>

        {/* Main Search Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input and Results List (Columns: 8/12) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Search Input Control */}
            <div className="relative flex items-center border border-border/60 bg-card/35 rounded-2xl px-4 py-3.5 glass focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background transition-all duration-200">
              <Search className="h-5 w-5 text-muted-foreground shrink-0 mr-3.5" />
              <input
                type="text"
                placeholder="Search by title, description, categories, or tags..."
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveSearch(query)}
                className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder-muted-foreground outline-none border-none focus:ring-0 w-full"
              />
              {query && (
                <button
                  onClick={() => handleQueryChange("")}
                  className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all shrink-0"
                  aria-label="Clear query"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              )}
            </div>

            {/* Results Output */}
            <div className="space-y-4">
              {query.trim() === "" ? (
                /* Prompt state when query is empty */
                <div className="rounded-2xl border border-border/50 bg-card/15 p-8 sm:p-12 text-center glass animate-fade-in">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 mx-auto mb-4">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Awaiting Search Query</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-2 leading-relaxed">
                    Type a query to search publications. Try topics like &ldquo;React 19&rdquo;, &ldquo;INP&rdquo;, or &ldquo;Performance&rdquo;.
                  </p>
                </div>
              ) : filtered.length > 0 ? (
                /* Results lists */
                <div className="space-y-4 animate-fade-in-up">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Found {filtered.length} {filtered.length === 1 ? "result" : "results"}
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {filtered.map((article) => (
                      <div key={article.id} onClick={handleSelectResult}>
                        <SearchResultCard article={article} query={query} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* No matching queries state */
                <div className="rounded-2xl border border-border/50 bg-card/15 p-8 sm:p-12 text-center glass animate-fade-in">
                  <div className="h-10 w-10 rounded-full bg-muted/40 text-muted-foreground flex items-center justify-center border border-border/60 mx-auto mb-4 animate-pulse">
                    <X className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">No matches found</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-2 leading-relaxed">
                    We couldn&apos;t find any publications matching &ldquo;{query}&rdquo;. Check spelling, try dynamic topics, or browse the widgets.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Taxonomy / Navigation Widgets (Columns: 4/12) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Search History Widget */}
            {recentSearches.length > 0 && (
              <div className="rounded-2xl border border-border/50 bg-card/30 p-5 glass">
                <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Search History</h3>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-[10px] font-bold text-muted-foreground/75 hover:text-destructive flex items-center gap-1 transition-colors duration-150"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQueryChange(search)}
                      className="flex items-center justify-between text-left text-xs font-medium text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-muted/30 transition-all duration-150 group"
                    >
                      <span className="truncate">{search}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150 text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Categories exploration */}
            <div className="rounded-2xl border border-border/50 bg-card/30 p-5 glass">
              <div className="flex items-center gap-2 border-b border-border/40 pb-3 mb-4">
                <FolderOpen className="h-4 w-4 text-accent" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Browse Categories</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/categories/${slugify(cat)}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all duration-150"
                  >
                    <span>{cat}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tags cloud */}
            <div className="rounded-2xl border border-border/50 bg-card/30 p-5 glass">
              <div className="flex items-center gap-2 border-b border-border/40 pb-3 mb-4">
                <Tag className="h-4 w-4 text-accent" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Explore Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${slugify(tag)}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-accent/20 transition-all duration-150"
                  >
                    <span>#{tag}</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
}
