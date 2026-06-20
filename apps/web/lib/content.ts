import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Article } from "./types";
import { AUTHORS } from "./authors";
import { MOCK_FEATURED_ARTICLE, MOCK_ARTICLES } from "./mock-data";
import { slugify } from "./utils";

const getArticlesPath = (): string => {
  const paths = [
    path.join(process.cwd(), "content/articles"),
    path.join(process.cwd(), "apps/web/content/articles"),
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return path.join(process.cwd(), "apps/web/content/articles");
};

const ARTICLES_PATH = getArticlesPath();

export interface RawFrontmatter {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  category: string;
  author: string; // The author ID key
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const filePath = path.join(ARTICLES_PATH, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) {
      // Look up in mock data as fallback for progressive migration
      const allMocks = [MOCK_FEATURED_ARTICLE, ...MOCK_ARTICLES];
      const mock = allMocks.find((a) => a.slug === slug);
      if (mock) {
        return mock;
      }
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    const frontmatter = data as RawFrontmatter;

    const authorProfile = AUTHORS[frontmatter.author] || {
      name: frontmatter.author,
      avatarUrl: "",
      role: "Guest Contributor",
      bio: "Contributor to Frontend Expert.",
    };

    return {
      id: frontmatter.id,
      title: frontmatter.title,
      slug,
      excerpt: frontmatter.excerpt,
      publishedAt: frontmatter.publishedAt,
      readTime: frontmatter.readTime,
      tags: frontmatter.tags,
      category: frontmatter.category,
      author: authorProfile,
      content,
    };
  } catch (error) {
    console.error(`Error reading article slug ${slug}:`, error);
    return null;
  }
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    const articles: Article[] = [];

    // 1. Load compiled MDX articles
    if (fs.existsSync(ARTICLES_PATH)) {
      const files = fs.readdirSync(ARTICLES_PATH);
      for (const file of files) {
        if (file.endsWith(".mdx")) {
          const slug = file.replace(/\.mdx$/, "");
          const article = await getArticleBySlug(slug);
          if (article) {
            articles.push(article);
          }
        }
      }
    }

    // 2. Load mock articles that are not yet migrated to MDX (deduplicated by id)
    const allMocks = [MOCK_FEATURED_ARTICLE, ...MOCK_ARTICLES];
    for (const mock of allMocks) {
      const exists = articles.some((a) => a.id === mock.id);
      if (!exists) {
        articles.push(mock);
      }
    }

    // Sort by publication date descending
    return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } catch (error) {
    console.error("Error reading all articles:", error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Slugify utility
// ---------------------------------------------------------------------------

export { slugify };

// ---------------------------------------------------------------------------
// Tag helpers
// ---------------------------------------------------------------------------

export interface TagWithCount {
  name: string;
  slug: string;
  count: number;
}

export async function getAllTags(): Promise<TagWithCount[]> {
  const articles = await getAllArticles();
  const tagCounts: Record<string, { name: string; count: number }> = {};

  articles.forEach((article) => {
    article.tags.forEach((tag) => {
      const slug = slugify(tag);
      if (!tagCounts[slug]) {
        tagCounts[slug] = { name: tag, count: 0 };
      }
      tagCounts[slug].count++;
    });
  });

  return Object.entries(tagCounts)
    .map(([slug, { name, count }]) => ({ name, slug, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export async function getArticlesByTag(tagSlug: string): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter((article) =>
    article.tags.some((tag) => slugify(tag) === tagSlug)
  );
}

// ---------------------------------------------------------------------------
// Category helpers
// ---------------------------------------------------------------------------

export interface CategoryWithCount {
  name: string;
  slug: string;
  count: number;
}

export async function getAllCategories(): Promise<CategoryWithCount[]> {
  const articles = await getAllArticles();
  const categoryCounts: Record<string, { name: string; count: number }> = {};

  articles.forEach((article) => {
    const slug = slugify(article.category);
    if (!categoryCounts[slug]) {
      categoryCounts[slug] = { name: article.category, count: 0 };
    }
    categoryCounts[slug].count++;
  });

  return Object.entries(categoryCounts)
    .map(([slug, { name, count }]) => ({ name, slug, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter((article) => slugify(article.category) === categorySlug);
}

// ---------------------------------------------------------------------------
// Related articles engine (scored by shared tags + category)
// ---------------------------------------------------------------------------

export async function getRelatedArticles(article: Article, limit = 2): Promise<Article[]> {
  const allArticles = await getAllArticles();

  const scored = allArticles
    .filter((a) => a.id !== article.id)
    .map((candidate) => {
      let score = 0;
      // +3 for same category
      if (candidate.category === article.category) score += 3;
      // +1 per shared tag
      candidate.tags.forEach((tag) => {
        if (article.tags.includes(tag)) score += 1;
      });
      return { article: candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ article }) => article);
}
