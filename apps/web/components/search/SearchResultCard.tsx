import React from "react";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { Article } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { Highlight } from "./Highlight";

interface SearchResultCardProps {
  article: Article;
  query: string;
  isFocused?: boolean;
}

export function SearchResultCard({ article, query, isFocused = false }: SearchResultCardProps) {
  const { title, slug, excerpt, publishedAt, readTime, category, tags } = article;

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border p-5 glass transition-all duration-300 ${
        isFocused
          ? "border-primary bg-primary/[0.03] ring-1 ring-primary shadow-lg shadow-primary/[0.02]"
          : "border-border/50 bg-card/20 hover:bg-card/45 hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.01]"
      }`}
    >
      {/* Top Meta: Category */}
      <div className="flex items-center justify-between mb-3.5 relative z-20">
        <Link
          href={`/categories/${slugify(category)}`}
          className="inline-block text-[10px] font-bold uppercase tracking-wider text-accent dark:text-accent/90 hover:text-primary transition-colors duration-150"
        >
          <Highlight text={category} query={query} />
        </Link>
        
        <div className="flex items-center space-x-3 text-[10px] text-muted-foreground/80 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{publishedAt}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 shrink-0" />
            <span>{readTime}</span>
          </span>
        </div>
      </div>

      {/* Title & Link */}
      <div className="flex-grow">
        <h4 className="text-base font-bold text-foreground leading-snug group-hover:text-primary dark:group-hover:text-primary-foreground/90 transition-colors duration-150">
          <Link href={`/blog/${slug}`} className="focus:outline-none">
            {/* Stretched overlay to capture clicks safely on the whole card */}
            <span className="absolute inset-0 rounded-2xl z-10" aria-hidden="true" />
            <Highlight text={title} query={query} />
          </Link>
        </h4>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
          <Highlight text={excerpt} query={query} />
        </p>
      </div>

      {/* Tags preview */}
      <div className="flex flex-wrap gap-1.5 pt-3.5 mt-3 border-t border-border/30 relative z-20">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${slugify(tag)}`}
            className="inline-flex items-center text-[9px] font-semibold text-muted-foreground bg-muted/20 px-2 py-0.5 rounded border border-border/40 hover:bg-muted/40 hover:text-accent hover:border-accent/20 transition-all duration-150"
          >
            #<Highlight text={tag} query={query} />
          </Link>
        ))}
      </div>
    </div>
  );
}
