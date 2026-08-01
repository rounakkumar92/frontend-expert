import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Article } from "./types";
import { AUTHORS } from "./authors";
import { MOCK_FEATURED_ARTICLE, MOCK_ARTICLES } from "./mock-data";
import { slugify } from "./utils";
import { prisma } from "./prisma";

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

function formatPrismaArticle(dbArticle: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: Date | null;
  readTime: string;
  category?: { name: string } | null;
  tags?: { name: string }[];
  author?: { name: string; avatarUrl: string | null; role: string; bio: string | null } | null;
}): Article {
  const publishedDate = dbArticle.publishedAt
    ? new Date(dbArticle.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently Published";

  return {
    id: dbArticle.id,
    title: dbArticle.title,
    slug: dbArticle.slug,
    excerpt: dbArticle.excerpt,
    publishedAt: publishedDate,
    readTime: dbArticle.readTime,
    category: dbArticle.category?.name || "General",
    tags: dbArticle.tags?.map((t) => t.name) || [],
    author: {
      name: dbArticle.author?.name || "Anonymous",
      avatarUrl: dbArticle.author?.avatarUrl || "",
      role: dbArticle.author?.role || "Author",
      bio: dbArticle.author?.bio || "",
    },
    content: dbArticle.content,
  };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    // 1. Try fetching from Neon PostgreSQL Database first
    try {
      const dbArticle = await prisma.article.findFirst({
        where: {
          slug,
          isDeleted: false,
          status: "PUBLISHED",
        },
        include: {
          author: true,
          category: true,
          tags: true,
        },
      });

      if (dbArticle) {
        return formatPrismaArticle(dbArticle);
      }
    } catch (dbErr) {
      console.warn("DB query failed in getArticleBySlug, falling back to local files:", dbErr);
    }

    // 2. Fallback to local MDX content files
    const filePath = path.join(ARTICLES_PATH, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
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
    }

    // 3. Fallback to mock data
    const allMocks = [MOCK_FEATURED_ARTICLE, ...MOCK_ARTICLES];
    const mock = allMocks.find((a) => a.slug === slug);
    if (mock) {
      return mock;
    }

    return null;
  } catch (error) {
    console.error(`Error reading article slug ${slug}:`, error);
    return null;
  }
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    const articlesMap = new Map<string, Article>();

    // 1. Load published articles from Neon PostgreSQL Database
    try {
      const dbArticles = await prisma.article.findMany({
        where: {
          isDeleted: false,
          status: "PUBLISHED",
          publishedAt: {
            lte: new Date(),
          },
        },
        include: {
          author: true,
          category: true,
          tags: true,
        },
        orderBy: { publishedAt: "desc" },
      });

      for (const dbArt of dbArticles) {
        const formatted = formatPrismaArticle(dbArt);
        articlesMap.set(formatted.slug, formatted);
      }
    } catch (dbErr) {
      console.warn("DB query failed in getAllArticles, using file fallback:", dbErr);
    }

    // 2. Load compiled MDX articles (only if not already provided by DB)
    if (fs.existsSync(ARTICLES_PATH)) {
      const files = fs.readdirSync(ARTICLES_PATH);
      for (const file of files) {
        if (file.endsWith(".mdx")) {
          const slug = file.replace(/\.mdx$/, "");
          if (!articlesMap.has(slug)) {
            const article = await getArticleBySlug(slug);
            if (article) {
              articlesMap.set(slug, article);
            }
          }
        }
      }
    }

    // 3. Load mock articles that are not yet in database or MDX
    const allMocks = [MOCK_FEATURED_ARTICLE, ...MOCK_ARTICLES];
    for (const mock of allMocks) {
      if (!articlesMap.has(mock.slug) && !Array.from(articlesMap.values()).some((a) => a.id === mock.id)) {
        articlesMap.set(mock.slug, mock);
      }
    }

    const articles = Array.from(articlesMap.values());
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
