import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getArticleBySlug } from "@/lib/content";

const bookmarkSchema = z.object({
  articleSlug: z.string().trim().min(1, "Article slug is required"),
});

// GET: Fetch all bookmarks for the authenticated reader
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Please sign in to view your bookmarks" },
      { status: 401 }
    );
  }

  try {
    const rawBookmarks = await prisma.bookmark.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    // Populate article information for each bookmarked slug
    const bookmarksWithArticles = await Promise.all(
      rawBookmarks.map(async (b) => {
        const article = await getArticleBySlug(b.articleSlug);
        return {
          id: b.id,
          articleSlug: b.articleSlug,
          createdAt: b.createdAt,
          article: article
            ? {
                title: article.title,
                slug: article.slug,
                excerpt: article.excerpt,
                category: article.category,
                readTime: article.readTime,
                publishedAt: article.publishedAt,
                author: article.author,
              }
            : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      bookmarks: bookmarksWithArticles,
    });
  } catch (error) {
    console.error("Error fetching reader bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

// POST: Add an article bookmark for the authenticated reader
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Please sign in to bookmark articles" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const result = bookmarkSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid bookmark request", details: result.error.format() },
        { status: 400 }
      );
    }

    const { articleSlug } = result.data;

    // Validate that the article exists and is published
    const article = await getArticleBySlug(articleSlug);
    if (!article) {
      return NextResponse.json(
        { error: `Article with slug "${articleSlug}" was not found or is unavailable.` },
        { status: 404 }
      );
    }

    // Upsert bookmark to guarantee idempotency and uniqueness
    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_articleSlug: {
          userId: session.userId,
          articleSlug,
        },
      },
      create: {
        userId: session.userId,
        articleSlug,
      },
      update: {},
    });

    return NextResponse.json(
      {
        success: true,
        bookmarked: true,
        bookmark: {
          id: bookmark.id,
          articleSlug: bookmark.articleSlug,
          createdAt: bookmark.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to save bookmark" },
      { status: 500 }
    );
  }
}

// DELETE: Remove an article bookmark for the authenticated reader
export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Please sign in to manage bookmarks" },
      { status: 401 }
    );
  }

  try {
    let articleSlug: string | null = null;

    // Check query parameter first (?slug=...)
    const querySlug = request.nextUrl.searchParams.get("slug");
    if (querySlug) {
      articleSlug = querySlug;
    } else {
      // Otherwise check JSON body
      try {
        const body = await request.json();
        const result = bookmarkSchema.safeParse(body);
        if (result.success) {
          articleSlug = result.data.articleSlug;
        }
      } catch {
        // Body might be empty
      }
    }

    if (!articleSlug) {
      return NextResponse.json(
        { error: "articleSlug query parameter or body is required" },
        { status: 400 }
      );
    }

    await prisma.bookmark.deleteMany({
      where: {
        userId: session.userId,
        articleSlug,
      },
    });

    return NextResponse.json({
      success: true,
      bookmarked: false,
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Failed to remove bookmark" },
      { status: 500 }
    );
  }
}
