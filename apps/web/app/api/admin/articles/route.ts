import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ArticleStatus, Prisma } from "@prisma/client";

const createArticleSchema = z.object({
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

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");
  const includeDeleted = searchParams.get("includeDeleted") === "true";

  try {
    const where: Prisma.ArticleWhereInput = {
      isDeleted: includeDeleted ? undefined : false,
    };

    if (status) {
      where.status = status as ArticleStatus;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true, avatarUrl: true },
        },
        category: true,
        tags: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Fetch articles API error:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = createArticleSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { title, slug, excerpt, content, status, publishedAt, readTime, categoryId, tagIds } = result.data;

    // Check slug uniqueness
    const existing = await prisma.article.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An article with this slug already exists" },
        { status: 400 }
      );
    }

    // Determine publishedAt date
    let publishDate: Date | null = null;
    if (status === ArticleStatus.PUBLISHED) {
      publishDate = publishedAt ? new Date(publishedAt) : new Date();
    } else if (status === ArticleStatus.SCHEDULED && publishedAt) {
      publishDate = new Date(publishedAt);
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        status,
        publishedAt: publishDate,
        readTime,
        authorId: session.userId,
        categoryId: categoryId || null,
        tags: tagIds ? {
          connect: tagIds.map((id) => ({ id })),
        } : undefined,
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error("Create article API error:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
