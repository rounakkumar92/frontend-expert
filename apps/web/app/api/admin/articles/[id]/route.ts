import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ArticleStatus } from "@prisma/client";

const updateArticleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  status: z.nativeEnum(ArticleStatus),
  publishedAt: z.string().optional().nullable(),
  readTime: z.string().min(1),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true,
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Retrieve article API error:", error);
    return NextResponse.json({ error: "Failed to retrieve article" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const result = updateArticleSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    // 1. Fetch current article details
    const current = await prisma.article.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!current) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const { title, slug, excerpt, content, status, publishedAt, readTime, categoryId, tagIds } = result.data;

    // 2. Check slug uniqueness if changed
    if (slug !== current.slug) {
      const existing = await prisma.article.findUnique({
        where: { slug },
      });
      if (existing) {
        return NextResponse.json(
          { error: "An article with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // 3. Determine publishedAt date
    let publishDate = current.publishedAt;
    if (status === ArticleStatus.PUBLISHED) {
      publishDate = publishedAt ? new Date(publishedAt) : (current.publishedAt || new Date());
    } else if (status === ArticleStatus.SCHEDULED && publishedAt) {
      publishDate = new Date(publishedAt);
    } else if (status === ArticleStatus.DRAFT) {
      publishDate = null;
    }

    // 4. Update and increment revisions
    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        status,
        publishedAt: publishDate,
        readTime,
        categoryId: categoryId || null,
        revisions: { increment: 1 },
        tags: tagIds ? {
          set: [],
          connect: tagIds.map((id) => ({ id })),
        } : undefined,
      },
      include: {
        category: true,
        tags: true,
      },
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Update article API error:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = request.nextUrl;
  const restore = searchParams.get("restore") === "true";

  try {
    const current = await prisma.article.findUnique({
      where: { id },
    });

    if (!current) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    let article;
    if (restore) {
      article = await prisma.article.update({
        where: { id },
        data: {
          isDeleted: false,
          deletedAt: null,
        },
      });
    } else {
      article = await prisma.article.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: restore ? "Article restored successfully" : "Article soft deleted successfully",
      article,
    });
  } catch (error) {
    console.error("Delete/Restore article API error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
