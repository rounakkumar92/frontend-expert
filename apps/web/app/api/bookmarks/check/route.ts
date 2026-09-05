import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug query parameter is required" }, { status: 400 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, bookmarked: false });
  }

  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_articleSlug: {
          userId: session.userId,
          articleSlug: slug,
        },
      },
    });

    return NextResponse.json({
      authenticated: true,
      bookmarked: !!bookmark,
    });
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return NextResponse.json({ authenticated: true, bookmarked: false });
  }
}
