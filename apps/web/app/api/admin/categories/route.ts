import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Fetch categories API error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = categorySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input values" }, { status: 400 });
    }

    const { name, slug } = result.data;

    // Check slug uniqueness
    const existing = await prisma.category.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json({ error: "Category slug already exists" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name, slug },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Create category API error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
