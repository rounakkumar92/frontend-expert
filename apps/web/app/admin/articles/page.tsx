"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, FileEdit, Trash2, RotateCcw, AlertCircle, Loader2 } from "lucide-react";

interface Author {
  name: string;
  email: string;
}

interface Category {
  name: string;
}

interface Tag {
  name: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  publishedAt: string | null;
  readTime: string;
  isDeleted: boolean;
  updatedAt: string;
  author: Author;
  category: Category | null;
  tags: Tag[];
  revisions: number;
}

export default function ArticlesAdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [showDeleted, setShowDeleted] = useState<boolean>(false);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/articles?includeDeleted=true");
      if (!res.ok) throw new Error("Failed to load articles");
      const data = await res.ok ? await res.json() : { articles: [] };
      setArticles(data.articles || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to soft delete this article?")) return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Deletion failed");
      // Update state locally
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isDeleted: true } : a))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete article");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}?restore=true`, { method: "DELETE" });
      if (!res.ok) throw new Error("Restoration failed");
      // Update state locally
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isDeleted: false } : a))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to restore article");
    }
  };

  // Filter logic
  const filteredArticles = articles.filter((article) => {
    // Soft deleted filter
    if (article.isDeleted !== showDeleted) return false;

    // Status filter
    if (statusFilter !== "ALL" && article.status !== statusFilter) return false;

    // Category filter
    if (categoryFilter !== "ALL" && article.category?.name !== categoryFilter) return false;

    // Search query
    if (search.trim()) {
      const query = search.toLowerCase();
      return (
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Articles Manager
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Write, review, publish, and delete engineering articles.
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-xs font-bold shadow hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between rounded-2xl border border-border bg-card/20 p-4 glass">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Multi Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Drafts</option>
            <option value="SCHEDULED">Scheduled</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Soft-deleted Toggle */}
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
              showDeleted
                ? "bg-destructive/15 text-destructive border-destructive/30"
                : "border-border hover:bg-muted/50 text-muted-foreground"
            }`}
          >
            {showDeleted ? "Viewing Deleted" : "View Deleted"}
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-border bg-card/40 glass shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground font-medium">Loading articles...</span>
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-destructive">
            <AlertCircle className="h-6 w-6" />
            <span className="text-xs font-bold">{error}</span>
            <button
              onClick={fetchArticles}
              className="mt-2 text-xs font-bold text-primary underline"
            >
              Try reloading
            </button>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-20 text-center text-xs text-muted-foreground">
            No articles found matching filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-card/25 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4 text-center">Revisions</th>
                  <th className="px-6 py-4">Updated At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-muted/15 transition-colors text-xs">
                    <td className="px-6 py-4 font-bold text-foreground">
                      <div className="max-w-xs sm:max-w-sm md:max-w-md truncate" title={article.title}>
                        {article.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-medium tracking-wide mt-0.5">
                        /{article.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">
                      {article.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          article.status === "PUBLISHED"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : article.status === "DRAFT"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">
                      {article.author.name}
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground font-semibold">
                      v{article.revisions}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">
                      {new Date(article.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      {!article.isDeleted ? (
                        <>
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="inline-flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                            title="Edit Article"
                          >
                            <FileEdit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="inline-flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            title="Soft Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleRestore(article.id)}
                          className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                          title="Restore"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-bold">Restore</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
