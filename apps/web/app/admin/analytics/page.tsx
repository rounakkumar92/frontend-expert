import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  BarChart3,
  Users,
  Search,
  Eye,
  TrendingUp,
  Compass,
  Smartphone,
  Monitor,
  Tablet,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface AnalyticsPageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function AdminAnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin");
  }

  const { range = "7d" } = await searchParams;

  // 1. Compute time boundary
  const now = Date.now();
  let startDate: Date | undefined;
  let rangeLabel = "Last 7 Days";

  if (range === "24h") {
    startDate = new Date(now - 24 * 60 * 60 * 1000);
    rangeLabel = "Last 24 Hours";
  } else if (range === "30d") {
    startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
    rangeLabel = "Last 30 Days";
  } else if (range === "all") {
    startDate = undefined;
    rangeLabel = "All Time";
  } else {
    // Default 7d
    startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
    rangeLabel = "Last 7 Days";
  }

  const dateFilter = startDate ? { createdAt: { gte: startDate } } : {};

  // 2. Fetch parallel aggregates
  const [
    totalViews,
    uniqueSessionsGroup,
    totalSearches,
    avgReadingProgress,
    completedReadsCount,
    topArticlesGroup,
    topQueriesGroup,
    zeroResultQueriesGroup,
    recentClicks,
    trafficSourcesGroup,
    deviceTypesGroup,
    milestone25,
    milestone50,
    milestone75,
    milestone90,
    recentViews,
  ] = await Promise.all([
    // Total Views
    prisma.articleView.count({ where: dateFilter }),

    // Unique Sessions
    prisma.articleView.findMany({
      where: dateFilter,
      distinct: ["sessionId"],
      select: { sessionId: true },
    }),

    // Total Searches
    prisma.searchEvent.count({ where: dateFilter }),

    // Average Reading Progress
    prisma.articleView.aggregate({
      where: {
        ...dateFilter,
        readingProgress: { not: null },
      },
      _avg: { readingProgress: true },
    }),

    // Reads reaching 75%+ completion
    prisma.articleView.count({
      where: {
        ...dateFilter,
        readingProgress: { gte: 75 },
      },
    }),

    // Top 10 Most Read Articles
    prisma.articleView.groupBy({
      by: ["articleSlug"],
      where: dateFilter,
      _count: { id: true },
      _avg: { readingProgress: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),

    // Top 8 Search Queries
    prisma.searchEvent.groupBy({
      by: ["query"],
      where: dateFilter,
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 8,
    }),

    // Top 8 Zero-Result Queries (Content discovery opportunities)
    prisma.searchEvent.groupBy({
      by: ["query"],
      where: {
        ...dateFilter,
        resultCount: 0,
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 8,
    }),

    // Recent Search Clicks
    prisma.searchEvent.findMany({
      where: {
        ...dateFilter,
        clickedSlug: { not: null },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        query: true,
        clickedSlug: true,
        createdAt: true,
      },
    }),

    // Traffic Sources
    prisma.articleView.groupBy({
      by: ["source"],
      where: dateFilter,
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 6,
    }),

    // Devices
    prisma.articleView.groupBy({
      by: ["device"],
      where: dateFilter,
      _count: { id: true },
    }),

    // Milestone Funnel
    prisma.articleView.count({ where: { ...dateFilter, readingProgress: { gte: 25 } } }),
    prisma.articleView.count({ where: { ...dateFilter, readingProgress: { gte: 50 } } }),
    prisma.articleView.count({ where: { ...dateFilter, readingProgress: { gte: 75 } } }),
    prisma.articleView.count({ where: { ...dateFilter, readingProgress: { gte: 90 } } }),

    // Recent Live Activity Stream
    prisma.articleView.findMany({
      where: dateFilter,
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        articleSlug: true,
        articleTitle: true,
        source: true,
        device: true,
        readingProgress: true,
        createdAt: true,
      },
    }),
  ]);

  // Fetch article metadata for top articles
  const topArticleSlugs = topArticlesGroup.map((item) => item.articleSlug);
  const matchedArticles = await prisma.article.findMany({
    where: { slug: { in: topArticleSlugs } },
    select: { slug: true, title: true, category: { select: { name: true } } },
  });
  const articleMetaMap = new Map(matchedArticles.map((a) => [a.slug, a]));

  const uniqueSessionsCount = uniqueSessionsGroup.length;
  const avgProgressPct = Math.round(avgReadingProgress._avg.readingProgress || 0);
  const completionRate =
    totalViews > 0 ? Math.round((completedReadsCount / totalViews) * 100) : 0;

  // Compute device percentages
  const totalDeviceCount = deviceTypesGroup.reduce((acc, curr) => acc + curr._count.id, 0);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header with Title and Range Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Content Intelligence & Analytics
            </h1>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Privacy-preserving, first-party telemetry tracking article performance, search intent, and reading depth.
          </p>
        </div>

        {/* Time Window Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/40 border border-border rounded-xl self-start sm:self-auto">
          {[
            { id: "24h", label: "24h" },
            { id: "7d", label: "7 Days" },
            { id: "30d", label: "30 Days" },
            { id: "all", label: "All Time" },
          ].map((item) => {
            const isActive = range === item.id;
            return (
              <Link
                key={item.id}
                href={`/admin/analytics?range=${item.id}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 glass shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Total Article Views
            </span>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-foreground">{totalViews.toLocaleString()}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Recorded across {rangeLabel.toLowerCase()}
          </p>
        </div>

        {/* Unique Sessions */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 glass shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Unique Reader Sessions
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-foreground">{uniqueSessionsCount.toLocaleString()}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Ephemeral anonymous sessions
          </p>
        </div>

        {/* Total Searches */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 glass shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Catalog Searches
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Search className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-foreground">{totalSearches.toLocaleString()}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Search queries & hotkey console
          </p>
        </div>

        {/* Average Reading Depth */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 glass shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Avg. Reading Depth
            </span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-foreground">{avgProgressPct}%</div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            <span className="text-purple-500 font-bold">{completionRate}%</span> reached 75%+ depth
          </p>
        </div>
      </div>

      {/* Main Grid: Most Read Articles & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Most Read Articles (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-border bg-card/40 p-6 glass shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Most Read Technical Publications
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Top consumed deep dives ranked by verified article views.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/40 px-2 py-1 rounded border border-border">
              {rangeLabel}
            </span>
          </div>

          {topArticlesGroup.length === 0 ? (
            <div className="py-12 text-center rounded-xl border border-dashed border-border/70">
              <Eye className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-xs font-bold text-foreground">No article views recorded yet</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Views will appear here automatically as readers browse content.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/80 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    <th className="pb-3 pl-2">#</th>
                    <th className="pb-3">Article Title</th>
                    <th className="pb-3 text-right">Views</th>
                    <th className="pb-3 text-right">Avg. Depth</th>
                    <th className="pb-3 text-right pr-2">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-xs">
                  {topArticlesGroup.map((item, idx) => {
                    const meta = articleMetaMap.get(item.articleSlug);
                    const title = meta?.title || item.articleSlug;
                    const category = meta?.category?.name || "Technical";
                    const depth = Math.round(item._avg.readingProgress || 0);

                    return (
                      <tr key={item.articleSlug} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 pl-2 font-mono text-[11px] text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="font-bold text-foreground line-clamp-1">{title}</div>
                          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                            /{item.articleSlug} · <span className="text-primary font-sans">{category}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right font-extrabold text-foreground">
                          {item._count.id.toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-muted-foreground">
                            {depth > 0 ? `${depth}%` : "—"}
                          </span>
                        </td>
                        <td className="py-3 text-right pr-2">
                          <Link
                            href={`/blog/${item.articleSlug}`}
                            target="_blank"
                            className="inline-flex items-center p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            aria-label={`Open ${title}`}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Live Reader Stream (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-border bg-card/40 p-6 glass shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Live Activity Stream
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Recent verified reading events in real-time.
            </p>
          </div>

          {recentViews.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No recent activity recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentViews.map((view) => (
                <div
                  key={view.id}
                  className="p-3 rounded-xl border border-border/40 bg-card/30 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-foreground truncate">
                      {view.articleTitle || view.articleSlug}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                      <span className="capitalize bg-muted px-1.5 py-0.5 rounded font-mono">
                        {view.source || "direct"}
                      </span>
                      <span>·</span>
                      <span className="capitalize">{view.device || "desktop"}</span>
                      {view.readingProgress ? (
                        <>
                          <span>·</span>
                          <span className="text-emerald-500 font-bold">{view.readingProgress}% read</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground/80 shrink-0 font-mono">
                    {new Date(view.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search Intelligence & Reading Funnel Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Search Intent (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-border bg-card/40 p-6 glass shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-500" />
                Search Intelligence & Content Gaps
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Understand what engineers search for and discover topics where no content exists.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Popular Queries */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <span>Top Search Queries</span>
                </h3>

                {topQueriesGroup.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4">No search queries logged.</p>
                ) : (
                  <div className="space-y-2">
                    {topQueriesGroup.map((q) => (
                      <div
                        key={q.query}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-muted/20 text-xs"
                      >
                        <span className="font-semibold text-foreground truncate">{q.query}</span>
                        <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
                          {q._count.id} searches
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Zero-Result Queries (Content Gaps) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Content Gaps (0 Results)</span>
                </h3>

                {zeroResultQueriesGroup.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4">
                    Zero missing queries! All searches yielded results.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {zeroResultQueriesGroup.map((q) => (
                      <div
                        key={q.query}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] text-xs"
                      >
                        <span className="font-semibold text-foreground truncate">{q.query}</span>
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider shrink-0">
                          {q._count.id} missed
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Click-Through Searches */}
            {recentClicks.length > 0 && (
              <div className="pt-4 border-t border-border/50">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Recent High-Intent Search Clicks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {recentClicks.map((click) => (
                    <div
                      key={click.id}
                      className="p-2 rounded-lg border border-border/30 bg-muted/10 flex items-center justify-between gap-2"
                    >
                      <span className="text-muted-foreground truncate">&ldquo;{click.query}&rdquo;</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="font-bold text-foreground truncate">{click.clickedSlug}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Discovery & Acquisition Breakdown (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Reading Depth Funnel */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 glass shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" />
                Reading Depth Funnel
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Reader drop-off by scroll milestone depth.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: "25% Read Depth (Initial Interest)", count: milestone25, color: "bg-blue-500" },
                { label: "50% Read Depth (Halfway)", count: milestone50, color: "bg-emerald-500" },
                { label: "75% Read Depth (Engaged)", count: milestone75, color: "bg-purple-500" },
                { label: "90% Read Depth (Full Read)", count: milestone90, color: "bg-primary" },
              ].map((item) => {
                const pct = totalViews > 0 ? Math.round((item.count / totalViews) * 100) : 0;
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-muted-foreground">{item.label}</span>
                      <span className="font-mono font-bold text-foreground">
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-300`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Traffic Sources & Device Distribution */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 glass shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-foreground">Traffic & Devices</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Acquisition channels and device preferences.
              </p>
            </div>

            {/* Sources */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Traffic Acquisition
              </span>
              <div className="space-y-1.5">
                {trafficSourcesGroup.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No source data yet.</p>
                ) : (
                  trafficSourcesGroup.map((src) => {
                    const count = src._count.id;
                    const pct = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
                    return (
                      <div key={src.source || "direct"} className="flex items-center justify-between text-xs">
                        <span className="capitalize font-medium text-foreground">
                          {src.source || "direct"}
                        </span>
                        <span className="font-mono text-muted-foreground text-[11px]">
                          {count} ({pct}%)
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Devices */}
            <div className="pt-3 border-t border-border/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                Device Distribution
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                {["desktop", "mobile", "tablet"].map((d) => {
                  const match = deviceTypesGroup.find((x) => x.device === d);
                  const count = match ? match._count.id : 0;
                  const pct = totalDeviceCount > 0 ? Math.round((count / totalDeviceCount) * 100) : 0;
                  const Icon = d === "desktop" ? Monitor : d === "mobile" ? Smartphone : Tablet;

                  return (
                    <div
                      key={d}
                      className="p-2.5 rounded-xl border border-border/40 bg-card/20 flex flex-col items-center gap-1"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">{d}</span>
                      <span className="text-xs font-extrabold text-foreground">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
