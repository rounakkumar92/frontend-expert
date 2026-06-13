import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Article } from "./types";
import { AUTHORS } from "./authors";
import { MOCK_FEATURED_ARTICLE, MOCK_ARTICLES } from "./mock-data";

const ARTICLES_PATH = path.join(process.cwd(), "content/articles");

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
