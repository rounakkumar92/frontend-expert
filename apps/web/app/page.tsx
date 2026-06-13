import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { ArticlesSection } from "@/components/sections/ArticlesSection";
import { NewsletterCTA } from "@/components/sections/NewsletterCTA";
import { getAllArticles } from "@/lib/content";
import { MOCK_FEATURED_ARTICLE, MOCK_ARTICLES } from "@/lib/mock-data";

export default async function Home() {
  const articles = await getAllArticles();

  // Determine featured and regular articles, with fallback to mocks if content is not compiled yet
  const featuredArticle =
    articles.find((a) => a.id === "featured-1") ||
    articles[0] ||
    MOCK_FEATURED_ARTICLE;

  const regularArticles =
    articles.length > 0
      ? articles.filter((a) => a.id !== featuredArticle.id)
      : MOCK_ARTICLES;

  return (
    <div className="flex flex-col flex-grow">
      {/* 1. Hero Section (Server Component) */}
      <HeroSection />

      {/* 2. Articles & Mock Simulation Grid (Client Component sub-tree) */}
      <ArticlesSection
        initialFeaturedArticle={featuredArticle}
        initialArticles={regularArticles}
      />

      {/* 3. Newsletter Subscription Panel (Server Component) */}
      <NewsletterCTA />
    </div>
  );
}
