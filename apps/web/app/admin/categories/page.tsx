"use client";

import React, { useState, useEffect } from "react";
import { Plus, AlertCircle, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    articles: number;
  };
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    const slugified = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(slugified);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create category");

      // Success
      setName("");
      setSlug("");
      fetchCategories(); // Reload list
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Categories Manager
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Organize publications into broad logical topics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Category List (2/3 columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card/40 p-6 glass space-y-4">
          <h2 className="text-sm font-bold text-foreground">Available Categories</h2>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Loading categories...</span>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-xs text-destructive flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No categories created yet.
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {categories.map((c) => (
                <div key={c.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground">{c.name}</span>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      slug: {c.slug}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold">
                    {c._count.articles} articles
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Create Category Form (1/3 columns) */}
        <div className="rounded-2xl border border-border bg-card/40 p-6 glass space-y-5">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-foreground">Create Category</h2>
            <p className="text-[10px] text-muted-foreground">
              Add a new category for publishing.
            </p>
          </div>

          {formError && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-muted-foreground">
                Category Name
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="e.g. Systems Design"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="slug" className="text-xs font-bold text-muted-foreground">
                URL Slug
              </label>
              <input
                id="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-border bg-background text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground py-2.5 text-xs font-bold shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              <span>Create Category</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
