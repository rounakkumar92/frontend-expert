import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArticleCard } from "@/components/ArticleCard";
import { getArticlesByTag, getAllTags, slugify } from "@/lib/content";
import { ArrowLeft, Hash } from "lucide-react";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tags = await getAllTags();
  const tag = tags.find((t) => t.slug === slug);

  if (!tag) {
    return {
      title: "Tag Not Found",
    };
  }

  return {
    title: `Articles tagged with #${tag.name}`,
    description: `Read technical articles, research papers, and deep dives tagged with #${tag.name} on Frontend Expert.`,
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tags = await getAllTags();
  const tag = tags.find((t) => t.slug === slug);

  if (!tag) {
    notFound();
  }

  const articles = await getArticlesByTag(slug);

  return (
    <div className="py-12 sm:py-16 md:py-20 bg-background">
      <Container>
        {/* Back Link */}
        <Link
          href="/tags"
          className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-foreground mb-8 group transition-colors duration-150 focus:outline-none"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform duration-150" />
          <span>All Tags</span>
        </Link>

        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <div className="flex items-center gap-2.5 mb-2">
            <Hash className="h-5 w-5 text-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Tagged Content
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            #{tag.name}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            {articles.length} {articles.length === 1 ? "publication" : "publications"} found matching this topic.
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {articles.map((article) => (
              <div key={article.id} className="animate-fade-in-up">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border/50 bg-card/10 p-12 text-center glass">
            <p className="text-muted-foreground font-medium">No publications found for this tag.</p>
          </div>
        )}
      </Container>
    </div>
  );
}
