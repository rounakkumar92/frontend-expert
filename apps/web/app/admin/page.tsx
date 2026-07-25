import React from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { FileText, Clock, FileEdit, FolderOpen, Tags, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();

  // 1. Fetch metrics in parallel from DB directly (Server Component)
  const [
    totalCount,
    publishedCount,
    draftCount,
    scheduledCount,
    categoriesCount,
    tagsCount,
    recentArticles,
  ] = await Promise.all([
    prisma.article.count({ where: { isDeleted: false } }),
    prisma.article.count({ where: { status: "PUBLISHED", isDeleted: false } }),
    prisma.article.count({ where: { status: "DRAFT", isDeleted: false } }),
    prisma.article.count({ where: { status: "SCHEDULED", isDeleted: false } }),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.article.findMany({
      where: { isDeleted: false },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        author: { select: { name: true } },
        category: true,
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Workspace Dashboard
        </h1>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Welcome back, <span className="font-bold text-foreground">{session?.name}</span>. Here is your publication snapshot.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-border bg-card/60 p-6 glass shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Total Publications
            </span>
            <div className="text-3xl font-extrabold text-foreground">{totalCount}</div>
            <span className="text-[10px] text-emerald-500 font-bold">{publishedCount} active published</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-border bg-card/60 p-6 glass shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Active Drafts
            </span>
            <div className="text-3xl font-extrabold text-foreground">{draftCount}</div>
            <span className="text-[10px] text-amber-500 font-bold">Unreleased changes</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <FileEdit className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-border bg-card/60 p-6 glass shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Scheduled Releases
            </span>
            <div className="text-3xl font-extrabold text-foreground">{scheduledCount}</div>
            <span className="text-[10px] text-blue-500 font-bold">Queueing to launch</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-border bg-card/60 p-6 glass shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Taxonomy Index
            </span>
            <div className="text-3xl font-extrabold text-foreground">
              {categoriesCount + tagsCount}
            </div>
            <span className="text-[10px] text-purple-500 font-bold">
              {categoriesCount} categories / {tagsCount} tags
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <FolderOpen className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Content Splitted Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Recent Revisions (2/3 columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card/40 p-6 glass space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-foreground">Recent Revisions</h2>
              <p className="text-[10px] text-muted-foreground">
                Your most recently updated publications.
              </p>
            </div>
            <Link
              href="/admin/articles"
              className="text-[10px] font-bold text-primary hover:text-primary/80 inline-flex items-center gap-0.5"
            >
              <span>View all</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-border/50">
            {recentArticles.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No articles created yet. Get started by writing your first article!
              </div>
            ) : (
              recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 space-y-1">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="text-xs font-bold text-foreground hover:text-primary block truncate"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                      <span>By {article.author.name}</span>
                      <span>•</span>
                      <span>{article.category?.name || "Uncategorized"}</span>
                      <span>•</span>
                      <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
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
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="p-1 rounded bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors text-[10px] font-bold"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Quick Actions & Guides (1/3 columns) */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 glass space-y-4">
            <h2 className="text-sm font-bold text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-2.5">
              <Link
                href="/admin/articles/new"
                className="flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-xs font-bold shadow hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Write New Article</span>
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 text-xs font-bold text-foreground py-2.5 transition-colors"
              >
                <FolderOpen className="h-4 w-4 text-primary/70" />
                <span>Add Category</span>
              </Link>
              <Link
                href="/admin/tags"
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 text-xs font-bold text-foreground py-2.5 transition-colors"
              >
                <Tags className="h-4 w-4 text-primary/70" />
                <span>Add Tag</span>
              </Link>
            </div>
          </div>

          {/* Tips Card */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 glass space-y-2">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Publisher Tip
            </h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              When scheduling articles, ensure the publication date is set correctly in the future. The system&apos;s automated route generator caches static params, so scheduled articles will appear automatically once their launch timestamp is reached.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
