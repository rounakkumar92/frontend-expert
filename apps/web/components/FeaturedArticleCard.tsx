import React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Terminal, Flame, Sparkles } from "lucide-react";
import { Article } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FeaturedArticleCardProps {
  article?: Article;
  skeleton?: boolean;
}

export function FeaturedArticleCard({
  article,
  skeleton = false,
}: FeaturedArticleCardProps) {
  if (skeleton || !article) {
    return (
      <div className="rounded-3xl border border-border/50 bg-card/40 p-6 sm:p-8 md:p-10 glass animate-pulse duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-5 w-24 rounded bg-muted/70" />
            <div className="space-y-3">
              <div className="h-8 w-full rounded bg-muted" />
              <div className="h-8 w-5/6 rounded bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-muted/60" />
              <div className="h-4 w-11/12 rounded bg-muted/60" />
              <div className="h-4 w-4/5 rounded bg-muted/60" />
            </div>
            <div className="h-4.5 w-32 rounded bg-muted/70 pt-2" />
            <div className="border-t border-border/40 my-6" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-muted/70" />
                <div className="h-4.5 w-28 rounded bg-muted/60" />
              </div>
              <div className="h-4.5 w-20 rounded bg-muted/60" />
            </div>
          </div>
          <div className="lg:col-span-5 hidden lg:block">
            <div className="h-64 rounded-2xl bg-muted/40 border border-border/30" />
          </div>
        </div>
      </div>
    );
  }

  const { title, slug, excerpt, publishedAt, readTime, category, author, tags } = article;

  return (
    <article className="group rounded-3xl border border-border/50 bg-card/30 p-6 sm:p-8 md:p-10 glass hover:bg-card/40 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/[0.03] transition-all duration-300 relative overflow-hidden">
      {/* Decorative Background Accent */}
      <div className="absolute -right-24 -top-24 w-[300px] h-[300px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center relative z-10">
        {/* Left Side: Article Content */}
        <div className="lg:col-span-7 flex flex-col h-full justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary dark:text-primary-foreground/90 shadow-sm">
                <Sparkles className="h-3 w-3 text-accent" />
                <span>Featured Post</span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/90">
                {category}
              </span>
            </div>

            <Link href={`/blog/${slug}`} className="group/link focus:outline-none block">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground leading-tight tracking-tight group-hover/link:text-primary dark:group-hover/link:text-primary-foreground/90 transition-colors duration-200">
                {title}
              </h3>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {excerpt}
              </p>
            </Link>

            {/* Tags preview */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center text-[10px] font-semibold text-muted-foreground bg-muted/20 px-2 py-0.5 rounded border border-border/40"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Link
              href={`/blog/${slug}`}
              className="inline-flex items-center text-sm font-bold text-primary dark:text-primary-foreground/90 hover:opacity-90 gap-1.5 select-none focus:outline-none"
            >
              <span>Read Full Deep Dive</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform duration-250" />
            </Link>

            {/* Divider */}
            <div className="border-t border-border/30 my-6" />

            {/* Meta info footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-3">
                {author.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={author.avatarUrl}
                    alt={author.name}
                    className="h-8 w-8 rounded-full border border-border/60 object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {author.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-foreground">{author.name}</div>
                  <div className="text-[10px] text-muted-foreground/80">{author.role || "Technical Writer"}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>{publishedAt}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{readTime}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Elegant Technical Graphic (pure CSS/interactive) */}
        <div className="lg:col-span-5 hidden lg:block h-72 border border-border/60 rounded-2xl bg-muted/10 relative overflow-hidden select-none p-5 shadow-inner">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-20" />
          
          {/* Mock Dev GUI or visual timeline representing web speed metrics */}
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center space-x-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-primary/40" />
                <span className="text-[10px] font-mono text-muted-foreground/80 pl-2">chrome-devtools // timeline</span>
              </div>
              <Flame className="h-3.5 w-3.5 text-accent animate-pulse" />
            </div>

            {/* Custom visual timeline graphs */}
            <div className="space-y-4 py-4 flex-grow flex flex-col justify-center">
              {/* Row 1: INP metric */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                  <span>Interaction to Next Paint (INP)</span>
                  <span className="text-accent font-bold">45ms (Excellent)</span>
                </div>
                <div className="h-2 rounded-full bg-muted/80 overflow-hidden flex">
                  <div className="h-full bg-accent rounded-full transition-all duration-500 w-[15%]" />
                </div>
              </div>

              {/* Row 2: LCP metric */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                  <span>Largest Contentful Paint (LCP)</span>
                  <span className="text-accent font-bold">1.2s (Fast)</span>
                </div>
                <div className="h-2 rounded-full bg-muted/80 overflow-hidden">
                  <div className="h-full bg-accent rounded-full w-[40%]" />
                </div>
              </div>

              {/* Row 3: CLS metric */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                  <span>Cumulative Layout Shift (CLS)</span>
                  <span className="text-accent font-bold">0.02 (Stable)</span>
                </div>
                <div className="h-2 rounded-full bg-muted/80 overflow-hidden">
                  <div className="h-full bg-accent rounded-full w-[8%]" />
                </div>
              </div>
            </div>

            {/* Bottom CLI block */}
            <div className="flex items-center space-x-2 bg-background/50 dark:bg-card/60 p-2.5 rounded-lg border border-border/40 font-mono text-[9px] text-foreground/80 leading-relaxed shadow-sm">
              <Terminal className="h-3 w-3 text-primary shrink-0" />
              <span className="truncate">pnpm test --run --watch=false // PASS (14 specs)</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
