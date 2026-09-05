"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TagPill } from "@/components/ui/TagPill";
import { FeaturedArticleCard } from "@/components/FeaturedArticleCard";
import { ArticleCard } from "@/components/ArticleCard";
import { MOCK_TRENDING_TAGS } from "@/lib/mock-data";
import { Article } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils";

interface ArticlesSectionProps {
  initialFeaturedArticle: Article;
  initialArticles: Article[];
}

export function ArticlesSection({
  initialFeaturedArticle,
  initialArticles,
}: ArticlesSectionProps) {
  return (
    <>
      {/* 2. Featured Article Section */}
      <section id="featured" className="py-16 md:py-24 border-b border-border/40 scroll-mt-14 bg-background">
        <Container>
          <SectionHeading
            tag="Flagship Research"
            title="Latest Core Deep Dive"
            description="Our primary technical analysis outlining breaking web engine developments, runtime specifications, and architecture."
          />
          <div className="animate-fade-in-up">
            <FeaturedArticleCard
              article={initialFeaturedArticle}
              skeleton={false}
            />
          </div>
        </Container>
      </section>

      {/* 3. Trending Topics Section */}
      <section id="topics" className="py-12 md:py-16 border-b border-border/30 bg-card/5 scroll-mt-14">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between border-b border-border/40 pb-5 mb-8">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-primary/95 dark:text-primary/90">
                Trending Knowledge
              </span>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                Explore Engineering Topics
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 group self-start md:self-auto"
            >
              <span>View all articles</span>
              <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform duration-150" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2.5 max-w-4xl">
            {MOCK_TRENDING_TAGS.map((tag) => (
              <TagPill
                key={tag}
                label={tag}
                href={`/tags/${slugify(tag)}`}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Latest Articles Grid Section */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeading
            tag="Latest Technical Bulletins"
            title="Recent Publications"
            description="Peer-reviewed engineering logs, tutorials, and deep architectural analyses."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {initialArticles.map((article) => (
              <div key={article.id} className="animate-fade-in-up">
                <ArticleCard
                  article={article}
                  skeleton={false}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
