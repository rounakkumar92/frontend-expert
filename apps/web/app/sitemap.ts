import type { MetadataRoute } from "next";
import { getAllArticles, getAllTags, getAllCategories } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  // 1. Static Pages
  const staticRoutes = ["", "/blog", "/search", "/tags", "/categories"];
  const staticPages = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Dynamic Articles
  const articles = await getAllArticles();
  const articlePages = articles.map((article) => {
    let date = new Date();
    const parsed = new Date(article.publishedAt);
    if (!isNaN(parsed.getTime())) {
      date = parsed;
    }
    
    return {
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: date,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  // 3. Dynamic Tags
  const tags = await getAllTags();
  const tagPages = tags.map((tag) => ({
    url: `${baseUrl}/tags/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // 4. Dynamic Categories
  const categories = await getAllCategories();
  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages, ...tagPages, ...categoryPages];
}
