import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const tagSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Fetch tags API error:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = tagSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input values" }, { status: 400 });
    }

    const { name, slug } = result.data;

    const existing = await prisma.tag.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json({ error: "Tag slug already exists" }, { status: 400 });
    }

    const tag = await prisma.tag.create({
      data: { name, slug },
    });

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    console.error("Create tag API error:", error);
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}
