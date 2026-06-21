import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getAllCategories } from "@/lib/content";
import { FolderOpen, ArrowLeft, ArrowRight, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse articles by category, including React, Performance, CSS, Modern Web Platform, and more.",
};

export default async function CategoriesIndexPage() {
  const categories = await getAllCategories();

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
            <FolderOpen className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Content Taxonomy
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Categories
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Discover deep dives organized by primary domains of modern frontend engineering.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-border/50 bg-card/30 p-6 glass hover:bg-card/50 hover:border-primary/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/15">
                    <Layers className="h-4 w-4" />
                  </div>
                  <span className="inline-flex h-5 min-w-[24px] items-center justify-center rounded-full bg-muted/60 px-2 text-[10px] font-bold text-muted-foreground">
                    {category.count} {category.count === 1 ? "article" : "articles"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-150">
                  {category.name}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Explore deep tech analyses and articles under the {category.name} category.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150 gap-1 select-none">
                <span>View Publications</span>
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform duration-150" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
