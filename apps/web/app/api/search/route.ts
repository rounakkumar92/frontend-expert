import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/content";

export async function GET() {
  try {
    const articles = await getAllArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Failed to fetch search articles index:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
