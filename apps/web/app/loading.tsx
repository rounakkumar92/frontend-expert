import React from "react";
import { Container } from "@/components/ui/container";
import { ArticleCard } from "@/components/ArticleCard";

export default function Loading() {
  return (
    <div className="py-12 sm:py-16 md:py-20 bg-background min-h-screen">
      <Container>
        {/* Page Header Skeleton */}
        <div className="max-w-3xl mb-12 md:mb-16 space-y-4 animate-pulse">
          <div className="h-4 w-32 rounded bg-muted/80" />
          <div className="h-10 w-2/3 rounded bg-muted" />
          <div className="h-5 w-full rounded bg-muted/60" />
        </div>

        {/* Featured Card Skeleton Grid */}
        <div className="mb-16 md:mb-20 rounded-3xl border border-border/50 bg-card/40 p-6 sm:p-8 md:p-10 glass animate-pulse duration-1000">
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
              </div>
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

        {/* Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <ArticleCard key={idx} skeleton />
          ))}
        </div>
      </Container>
    </div>
  );
}
