"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const router = useRouter();
  const { id } = use(params);

  // Settings states
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [, setIsLoadingMetadata] = useState(true);
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "SCHEDULED">("DRAFT");
  const [publishedAt, setPublishedAt] = useState("");
  const [readTime, setReadTime] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [revisions, setRevisions] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple slugify helper (only run manual or when slug is empty, don't override existing saved slugs on title edits unless desired)
  const handleTitleChange = (val: string) => {
    setTitle(val);
  };

  // Sync content word count with read time dynamically
  useEffect(() => {
    if (!isLoadingArticle && content) {
      const words = content.trim().split(/\s+/).filter(Boolean).length;
      const minutes = Math.max(1, Math.ceil(words / 200));
      setReadTime(`${minutes} min read`);
    }
  }, [content, isLoadingArticle]);

  const loadMetadata = async () => {
    setIsLoadingMetadata(true);
    try {
      const [catRes, tagRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/tags"),
      ]);
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
      if (tagRes.ok) {
        const tagData = await tagRes.json();
        setTags(tagData.tags || []);
      }
    } catch (err) {
      console.error("Failed to load metadata", err);
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  const loadArticle = useCallback(async () => {
    setIsLoadingArticle(true);
    try {
      const res = await fetch(`/api/admin/articles/${id}`);
      if (!res.ok) throw new Error("Failed to retrieve article details");
      const data = await res.json();
      const art = data.article;

      setTitle(art.title);
      setSlug(art.slug);
      setExcerpt(art.excerpt);
      setContent(art.content);
      setStatus(art.status);
      setReadTime(art.readTime);
      setCategoryId(art.categoryId || "");
      setSelectedTagIds(art.tags?.map((t: { id: string }) => t.id) || []);
      setRevisions(art.revisions);

      if (art.publishedAt) {
        // format ISO date to datetime-local format: YYYY-MM-DDTHH:MM
        const localDate = new Date(art.publishedAt);
        const yyyy = localDate.getFullYear();
        const mm = String(localDate.getMonth() + 1).padStart(2, "0");
        const dd = String(localDate.getDate()).padStart(2, "0");
        const hh = String(localDate.getHours()).padStart(2, "0");
        const min = String(localDate.getMinutes()).padStart(2, "0");
        setPublishedAt(`${yyyy}-${mm}-${dd}T${hh}:${min}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred while loading the article");
    } finally {
      setIsLoadingArticle(false);
    }
  }, [id]);

  useEffect(() => {
    loadMetadata();
    loadArticle();
  }, [id, loadArticle]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((item) => item !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate scheduled date if status is SCHEDULED
    if (status === "SCHEDULED" && !publishedAt) {
      setError("Please specify a release date for scheduled publishing.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          status,
          publishedAt: status !== "DRAFT" && publishedAt ? new Date(publishedAt).toISOString() : null,
          readTime,
          categoryId: categoryId || null,
          tagIds: selectedTagIds,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update article");
      }

      router.push("/admin/articles");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  if (isLoadingArticle) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-medium">Loading article editor...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl">
      {/* Top action bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              Edit Article
            </h1>
            <p className="text-[10px] text-muted-foreground">
              Editing version <span className="font-bold text-primary">v{revisions}</span>. All modifications increment revisions.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-xs font-bold shadow hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor & Settings Side-by-side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Editor Canvas (2/3 columns) */}
        <div className="lg:col-span-2 space-y-4 rounded-2xl border border-border bg-card/40 p-6 glass">
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-xs font-bold text-muted-foreground">
              Article Title
            </label>
            <input
              id="title"
              type="text"
              required
              placeholder="e.g. Mastering CSS Grid Layout"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="excerpt" className="text-xs font-bold text-muted-foreground">
              Excerpt / Brief Summary
            </label>
            <textarea
              id="excerpt"
              required
              rows={2}
              placeholder="A short snippet shown on the blog feed pages (150-200 chars)..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="content" className="text-xs font-bold text-muted-foreground">
              Content (Markdown Format Supported)
            </label>
            <textarea
              id="content"
              required
              rows={15}
              placeholder="# Introduction..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Right Side: Publication Settings Sidebar (1/3 columns) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/40 p-6 glass space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Publication Settings
            </h2>

            {/* Status Selector */}
            <div className="space-y-1.5">
              <label htmlFor="status" className="text-[11px] font-bold text-muted-foreground">
                Release Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED" | "SCHEDULED")}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published Instantly</option>
                <option value="SCHEDULED">Scheduled Release</option>
              </select>
            </div>

            {/* Scheduled Release Date Picker */}
            {status !== "DRAFT" && (
              <div className="space-y-1.5">
                <label htmlFor="publishedAt" className="text-[11px] font-bold text-muted-foreground">
                  {status === "SCHEDULED" ? "Schedule Date & Time" : "Override Release Date"}
                </label>
                <input
                  id="publishedAt"
                  type="datetime-local"
                  required={status === "SCHEDULED"}
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
                />
              </div>
            )}

            {/* Read Time (Auto-calculated but overrideable) */}
            <div className="space-y-1.5">
              <label htmlFor="readTime" className="text-[11px] font-bold text-muted-foreground">
                Estimated Read Time
              </label>
              <input
                id="readTime"
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
              />
            </div>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label htmlFor="category" className="text-[11px] font-bold text-muted-foreground">
                Category
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none"
              >
                <option value="">Choose category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom URL Slug */}
            <div className="space-y-1.5">
              <label htmlFor="slug" className="text-[11px] font-bold text-muted-foreground">
                URL Slug
              </label>
              <input
                id="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Tags List Selection Card */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 glass space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">Tags</h2>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {tags.length === 0 ? (
                <span className="text-[10px] text-muted-foreground">No tags available. Add some in Tag Manager.</span>
              ) : (
                tags.map((tag) => {
                  const isChecked = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                        isChecked
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "border-border hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      #{tag.name}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
