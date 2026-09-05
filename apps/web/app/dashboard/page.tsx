import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getArticleBySlug } from "@/lib/content";
import { DashboardClient, BookmarkedArticleItem } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Reader Dashboard",
  description: "Your personalized reader workspace and saved technical articles.",
};

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?from=/dashboard");
  }

  // Fetch bookmarks for the authenticated reader
  const rawBookmarks = await prisma.bookmark.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  // Populate article metadata
  const initialBookmarks: BookmarkedArticleItem[] = await Promise.all(
    rawBookmarks.map(async (b) => {
      const article = await getArticleBySlug(b.articleSlug);
      return {
        id: b.id,
        articleSlug: b.articleSlug,
        createdAt: b.createdAt.toISOString(),
        article: article
          ? {
              title: article.title,
              slug: article.slug,
              excerpt: article.excerpt,
              category: article.category,
              readTime: article.readTime,
              publishedAt: article.publishedAt,
              author: {
                name: article.author.name,
                avatarUrl: article.author.avatarUrl,
              },
            }
          : null,
      };
    })
  );

  return (
    <DashboardClient
      initialUser={session}
      initialBookmarks={initialBookmarks}
    />
  );
}
