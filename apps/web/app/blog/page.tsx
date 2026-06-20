import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedArticleCard } from "@/components/FeaturedArticleCard";
import { ArticleCard } from "@/components/ArticleCard";
import { getAllArticles, getAllTags, getAllCategories, slugify } from "@/lib/content";
import { Tag, FolderOpen, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Frontend Expert",
  description:
    "Explore in-depth technical articles on React, performance, CSS, accessibility, build tools, and modern frontend architecture.",
};

export default async function BlogIndexPage() {
  const articles = await getAllArticles();
  const tags = await getAllTags();
  const categories = await getAllCategories();

  const featuredArticle =
    articles.find((a) => a.id === "featured-1") || articles[0];
  const regularArticles = articles.filter(
    (a) => a.id !== featuredArticle?.id
  );

  return (
    <div className="py-12 sm:py-16 md:py-20 bg-background">
      <Container>
        {/* Page Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary/95 dark:text-primary/90">
            Engineering Journal
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            All Publications
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Deep technical analyses, performance breakdowns, and architecture blueprints for the modern web platform.
          </p>
        </div>

        {/* Quick-nav: Categories & Tags */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12 md:mb-16">
          {/* Categories */}
          <div className="flex-1 rounded-2xl border border-border/50 bg-card/30 p-5 glass">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Categories</h3>
              </div>
              <Link
                href="/categories"
                className="text-[11px] font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 group transition-colors duration-150"
              >
                <span>View all</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-150" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/50 px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:border-primary/20 transition-all duration-150"
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-muted-foreground/60">{cat.count}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex-1 rounded-2xl border border-border/50 bg-card/30 p-5 glass">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-bold text-foreground">Popular Tags</h3>
              </div>
              <Link
                href="/tags"
                className="text-[11px] font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 group transition-colors duration-150"
              >
                <span>View all</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-150" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 10).map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/50 px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:border-accent/20 transition-all duration-150"
                >
                  <span>#{tag.name}</span>
                  <span className="text-[10px] text-muted-foreground/60">{tag.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-16 md:mb-20">
            <SectionHeading
              tag="Flagship Research"
              title="Featured Deep Dive"
              description="Our primary technical analysis on the latest web platform developments."
            />
            <FeaturedArticleCard article={featuredArticle} />
          </section>
        )}

        {/* All Articles Grid */}
        <section>
          <SectionHeading
            tag="Archive"
            title="All Articles"
            description={`${articles.length} publications and counting.`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {regularArticles.map((article) => (
              <div key={article.id} className="animate-fade-in-up">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
