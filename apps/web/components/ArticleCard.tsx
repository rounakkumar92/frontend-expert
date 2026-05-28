import React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Article } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article?: Article;
  skeleton?: boolean;
}

export function ArticleCard({ article, skeleton = false }: ArticleCardProps) {
  if (skeleton || !article) {
    return (
      <div className="group flex flex-col h-full rounded-2xl border border-border/50 bg-card/40 p-6 glass animate-pulse duration-1000">
        {/* Category Pill */}
        <div className="h-5 w-20 rounded bg-muted/70 mb-4" />
        
        {/* Title Lines */}
        <div className="space-y-2 mb-4 flex-grow">
          <div className="h-6 w-full rounded bg-muted" />
          <div className="h-6 w-4/5 rounded bg-muted" />
        </div>

        {/* Excerpt Lines */}
        <div className="space-y-1.5 mb-6">
          <div className="h-4 w-full rounded bg-muted/60" />
          <div className="h-4 w-11/12 rounded bg-muted/60" />
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 my-4" />

        {/* Footer Meta */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-muted/70" />
            <div className="h-4.5 w-24 rounded bg-muted/60" />
          </div>
          <div className="h-4 w-12 rounded bg-muted/60" />
        </div>
      </div>
    );
  }

  const { title, slug, excerpt, publishedAt, readTime, category, author } = article;

  return (
    <article className="group flex flex-col h-full rounded-2xl border border-border/50 bg-card/30 p-6 glass hover:bg-card/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.02] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background transition-all duration-300">
      {/* Category Pill */}
      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-accent dark:text-accent/90 mb-3.5 self-start">
        {category}
      </span>
      
      {/* Title */}
      <Link href={`/blog/${slug}`} className="group/link focus:outline-none flex-grow">
        <h3 className="text-xl font-bold text-foreground leading-snug group-hover/link:text-primary dark:group-hover/link:text-primary-foreground/90 transition-colors duration-200">
          {title}
        </h3>
        <p className="mt-3.5 text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {excerpt}
        </p>
      </Link>

      {/* Decorative Arrow link for accessibility */}
      <div className="mt-6 flex items-center text-xs font-semibold text-primary/80 group-hover:text-primary transition-colors duration-200 gap-1 select-none">
        <span>Read Article</span>
        <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform duration-200" />
      </div>

      {/* Divider */}
      <div className="border-t border-border/30 my-4" />

      {/* Footer Meta info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
        <div className="flex items-center space-x-2.5">
          {author.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={author.avatarUrl}
              alt={author.name}
              className="h-6.5 w-6.5 rounded-full border border-border/60 object-cover"
            />
          ) : (
            <div className="h-6.5 w-6.5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
              {author.name.charAt(0)}
            </div>
          )}
          <span className="font-medium text-foreground/80 hover:text-foreground transition-colors duration-150">
            {author.name}
          </span>
        </div>

        <div className="flex items-center space-x-3.5">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{publishedAt}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{readTime}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
