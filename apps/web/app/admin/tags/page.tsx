"use client";

import React, { useState, useEffect } from "react";
import { Plus, AlertCircle, Loader2 } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count: {
    articles: number;
  };
}

export default function TagsAdminPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/tags");
      if (!res.ok) throw new Error("Failed to fetch tags");
      const data = await res.json();
      setTags(data.tags || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
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
      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create tag");

      // Success
      setName("");
      setSlug("");
      fetchTags(); // Reload list
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
          Tags Manager
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage keyword labels for dynamic content filtering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Tag List (2/3 columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card/40 p-6 glass space-y-4">
          <h2 className="text-sm font-bold text-foreground">Available Tags</h2>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Loading tags...</span>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-xs text-destructive flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          ) : tags.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No tags created yet.
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3.5 py-2 glass"
                >
                  <span className="text-xs font-bold text-foreground">#{tag.name}</span>
                  <span className="h-4 px-1 rounded bg-muted text-[10px] font-semibold text-muted-foreground flex items-center justify-center">
                    {tag._count.articles}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Create Tag Form (1/3 columns) */}
        <div className="rounded-2xl border border-border bg-card/40 p-6 glass space-y-5">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-foreground">Create Tag</h2>
            <p className="text-[10px] text-muted-foreground">
              Add a new tag for dynamic indexing.
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
                Tag Name
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="e.g. state-management"
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
              <span>Create Tag</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
