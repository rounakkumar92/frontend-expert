import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { getAllArticles } from "@/lib/content";
import { SearchPageClient } from "./SearchPageClient";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Search Publications",
  description: "Search technical articles, deep dives, tags, and categories on modern frontend engineering.",
};

function SearchPageFallback() {
  return (
    <div className="py-12 sm:py-16 md:py-20 bg-background min-h-screen animate-pulse duration-1000">
      <Container>
        {/* Back Link */}
        <div className="h-4 w-24 rounded bg-muted/65 mb-8" />

        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-3.5">
          <div className="h-4.5 w-20 rounded bg-muted/80" />
          <div className="h-8 w-2/3 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted/60" />
        </div>

        {/* Grid Fallback */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-12 w-full rounded-2xl bg-muted/40 border border-border/20" />
            <div className="h-64 rounded-2xl bg-muted/20 border border-border/10" />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="h-32 rounded-2xl bg-muted/20 border border-border/10" />
            <div className="h-32 rounded-2xl bg-muted/20 border border-border/10" />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default async function SearchPage() {
  const articles = await getAllArticles();

  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageClient initialArticles={articles} />
    </Suspense>
  );
}
