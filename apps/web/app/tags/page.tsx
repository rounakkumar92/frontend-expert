import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getAllTags } from "@/lib/content";
import { Tag, ArrowLeft, Hash } from "lucide-react";

export const metadata: Metadata = {
  title: "Tags | Frontend Expert",
  description:
    "Browse all article tags across the Frontend Expert engineering journal.",
};

export default async function TagsIndexPage() {
  const tags = await getAllTags();

  return (
    <div className="py-12 sm:py-16 md:py-20 bg-background">
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
        <div className="max-w-3xl mb-12 md:mb-16">
          <div className="flex items-center gap-2.5 mb-2">
            <Tag className="h-5 w-5 text-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Knowledge Map
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            All Tags
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Explore {tags.length} topics across the engineering journal. Click any tag to discover related publications.
          </p>
        </div>

        {/* Tag Cloud */}
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className="group inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/30 px-4 py-2.5 glass hover:bg-card/50 hover:border-accent/30 hover:shadow-md hover:shadow-accent/[0.04] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <Hash className="h-3.5 w-3.5 text-accent/70 group-hover:text-accent transition-colors duration-150" />
              <span className="text-sm font-bold text-foreground">{tag.name}</span>
              <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted/60 px-1.5 text-[10px] font-bold text-muted-foreground">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
