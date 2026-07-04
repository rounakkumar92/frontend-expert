import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { MDXRenderer } from "@/components/article/MDXRenderer";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { ShareActions } from "@/components/article/ShareActions";
import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getArticleBySlug, getAllArticles, getRelatedArticles, slugify } from "@/lib/content";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

// 1. Generate dynamic SEO Meta Tags for high-fidelity search indexability
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const baseUrl = "https://frontendexpert.com";

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${baseUrl}/blog/${slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
      siteName: "Frontend Expert",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

// 2. Generate Static Paths for Next.js Static Site Generation (SSG)
export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  // Return standard Next.js dynamic 404 if route is unrecognized
  if (!article) {
    notFound();
  }

  const { title, excerpt, publishedAt, readTime, category, author, content, tags } = article;

  const relatedArticles = await getRelatedArticles(article, 2);

  const baseUrl = "https://frontendexpert.com";

  // JSON-LD: TechArticle schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description: excerpt,
    datePublished: publishedAt,
    author: {
      "@type": "Person",
      name: author.name,
      ...(author.avatarUrl ? { image: author.avatarUrl } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: "Frontend Expert",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${slug}`,
    },
    keywords: tags.join(", "),
    articleSection: category,
  };

  // JSON-LD: Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${baseUrl}/blog/${slug}`,
      },
    ],
  };

  return (
    <div className="relative py-8 sm:py-12 md:py-16 bg-background scroll-smooth">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Scroll indicator timeline */}
      <ReadingProgress />

      <Container>
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-foreground mb-8 group transition-colors duration-150 focus:outline-none"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform duration-150" />
          <span>Back to Blog</span>
        </Link>

        {/* 3. Header Block: Spacings and Typography hierarchies */}
        <header className="max-w-4xl border-b border-border/40 pb-8 mb-10 md:mb-14">
          <Link
            href={`/categories/${slugify(category)}`}
            className="inline-block text-xs font-bold uppercase tracking-wider text-accent dark:text-accent/90 hover:text-primary mb-3.5 transition-colors duration-150"
          >
            {category}
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground sm:leading-tight">
            {title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            {excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
            {/* Author Meta */}
            <div className="flex items-center space-x-3.5">
              {author.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={author.avatarUrl}
                  alt={author.name}
                  className="h-9 w-9 rounded-full border border-border/60 object-cover"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                  {author.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-foreground">{author.name}</div>
                <div className="text-[11px] text-muted-foreground/80 font-medium">{author.role}</div>
              </div>
            </div>

            {/* Read Stats */}
            <div className="flex items-center space-x-4 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{publishedAt}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{readTime}</span>
              </span>
            </div>
          </div>
        </header>

        {/* 4. Article Main Layout: 12-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* A. Sidebar Side-rail (Columns: 3/12 - Desktop) */}
          <aside className="lg:col-span-3 space-y-10 lg:sticky lg:top-24">
            <ShareActions title={title} slug={slug} />
          </aside>

          {/* B. Central Reading Canvas (Columns: 9/12) */}
          <main className="lg:col-span-9 col-span-12 max-w-3xl lg:border-l lg:border-border/30 lg:pl-10">
            {/* Mobile-only Table of Contents Dropdown */}
            <div className="block lg:hidden">
              <TableOfContents content={content} />
            </div>

            {/* Markdown rendered body */}
            <article className="min-h-[300px]">
              <MDXRenderer content={content} />
            </article>

            {/* Tags footer block */}
            <div className="flex flex-wrap gap-2 mt-10 border-t border-border/30 pt-6">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${slugify(tag)}`}
                  className="inline-flex items-center rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-accent hover:border-accent/30 hover:bg-card/50 transition-all duration-150"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            {/* 5. Author Biography Card */}
            {author.bio && (
              <section className="mt-12 md:mt-16 rounded-2xl border border-border/50 bg-card/20 p-6 sm:p-8 glass flex flex-col sm:flex-row gap-5 items-start">
                {author.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={author.avatarUrl}
                    alt={author.name}
                    className="h-14 w-14 rounded-full border border-border/60 object-cover shrink-0"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20 shrink-0">
                    {author.name.charAt(0)}
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-foreground text-base leading-none">
                      Written by {author.name}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded border border-primary/15 leading-none">
                      Author
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/90 leading-relaxed font-normal">
                    {author.bio}
                  </p>
                </div>
              </section>
            )}
          </main>
        </div>

        {/* 6. Related Articles Recomendation Deck */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 md:mt-24 border-t border-border/40 pt-12 md:pt-16">
            <SectionHeading
              tag="Expand Your Stack"
              title="Related Publications"
              description="Deepen your expertise by exploring recommended systems design, performance analysis, and react logs."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl">
              {relatedArticles.map((relArt) => (
                <div key={relArt.id} className="animate-fade-in-up">
                  <ArticleCard article={relArt} />
                </div>
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
