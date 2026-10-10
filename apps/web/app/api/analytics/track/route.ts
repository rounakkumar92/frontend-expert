import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security";

export const dynamic = "force-dynamic";

// Strict event payload schema validation (Abuse & injection protection)
const analyticsEventSchema = z.discriminatedUnion("eventType", [
  z.object({
    eventType: z.literal("ARTICLE_VIEW"),
    articleSlug: z.string().trim().min(1).max(150),
    articleTitle: z.string().trim().max(250).optional(),
    sessionId: z.string().trim().min(1).max(64),
    source: z.string().trim().max(100).optional(),
    fromSlug: z.string().trim().max(150).optional(),
    device: z.enum(["mobile", "tablet", "desktop"]).optional(),
    readingProgress: z.number().int().min(0).max(100).optional(),
  }),
  z.object({
    eventType: z.literal("READING_PROGRESS"),
    articleSlug: z.string().trim().min(1).max(150),
    sessionId: z.string().trim().min(1).max(64),
    readingProgress: z.number().int().min(0).max(100),
  }),
  z.object({
    eventType: z.literal("SEARCH"),
    query: z.string().trim().min(1).max(100),
    resultCount: z.number().int().min(0).max(10000),
    clickedSlug: z.string().trim().max(150).optional(),
    sessionId: z.string().trim().max(64).optional(),
  }),
  z.object({
    eventType: z.literal("DISCOVERY_CLICK"),
    discoveryType: z.enum(["CATEGORY_CLICK", "TAG_CLICK", "RELATED_CLICK", "HOMEPAGE_CLICK"]),
    target: z.string().trim().min(1).max(150),
    fromSlug: z.string().trim().max(150).optional(),
    sessionId: z.string().trim().max(64).optional(),
  }),
]);

export async function POST(request: NextRequest) {
  try {
    // 1. Coarse rate-limiting to prevent event flooding (max 100 events / minute per client IP)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimit = checkRateLimit(`analytics:${clientIp}`, 100, 60 * 1000);
    if (!rateLimit.success) {
      return new NextResponse(null, { status: 429 });
    }

    // 2. Parse and validate JSON body (with length guard)
    const rawBody = await request.text();
    if (rawBody.length > 4096) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const result = analyticsEventSchema.safeParse(parsedJson);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const data = result.data;

    // 3. Derive authenticated user ID strictly from server session (never trust client payload)
    const session = await getSession();
    const userId = session?.userId || null;

    // 4. Handle event types
    if (data.eventType === "ARTICLE_VIEW") {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

      // Deduplication check: Has this anonymous session viewed this article in the last 15 minutes?
      const recentView = await prisma.articleView.findFirst({
        where: {
          sessionId: data.sessionId,
          articleSlug: data.articleSlug,
          createdAt: { gte: fifteenMinutesAgo },
        },
        orderBy: { createdAt: "desc" },
      });

      if (recentView) {
        // Update reading progress if newly reported progress is greater
        if (
          data.readingProgress &&
          (!recentView.readingProgress || data.readingProgress > recentView.readingProgress)
        ) {
          await prisma.articleView.update({
            where: { id: recentView.id },
            data: { readingProgress: data.readingProgress },
          });
        }
        // Deduplicated: don't create a new view row
        return new NextResponse(null, { status: 204 });
      }

      // Record new article view
      await prisma.articleView.create({
        data: {
          articleSlug: data.articleSlug,
          articleTitle: data.articleTitle || null,
          userId,
          sessionId: data.sessionId,
          source: data.source || "direct",
          fromSlug: data.fromSlug || null,
          device: data.device || "desktop",
          readingProgress: data.readingProgress || null,
        },
      });

      return new NextResponse(null, { status: 204 });
    }

    if (data.eventType === "READING_PROGRESS") {
      // Find the most recent view in this session for this article
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const view = await prisma.articleView.findFirst({
        where: {
          sessionId: data.sessionId,
          articleSlug: data.articleSlug,
          createdAt: { gte: oneHourAgo },
        },
        orderBy: { createdAt: "desc" },
      });

      if (view && (!view.readingProgress || data.readingProgress > view.readingProgress)) {
        await prisma.articleView.update({
          where: { id: view.id },
          data: { readingProgress: data.readingProgress },
        });
      }

      return new NextResponse(null, { status: 204 });
    }

    if (data.eventType === "SEARCH") {
      await prisma.searchEvent.create({
        data: {
          query: data.query,
          resultCount: data.resultCount,
          clickedSlug: data.clickedSlug || null,
          userId,
          sessionId: data.sessionId || null,
        },
      });

      return new NextResponse(null, { status: 204 });
    }

    if (data.eventType === "DISCOVERY_CLICK") {
      await prisma.discoveryEvent.create({
        data: {
          type: data.discoveryType,
          target: data.target,
          fromSlug: data.fromSlug || null,
          sessionId: data.sessionId || null,
        },
      });

      return new NextResponse(null, { status: 204 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // Non-critical endpoint: log server error safely without sensitive data
    console.error("Analytics ingestion error:", error);
    return new NextResponse(null, { status: 500 });
  }
}
