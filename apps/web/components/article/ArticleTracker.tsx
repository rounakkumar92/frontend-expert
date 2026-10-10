"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { trackArticleView, trackReadingMilestone } from "@/lib/analytics-client";

interface ArticleTrackerProps {
  articleSlug: string;
  articleTitle: string;
}

export function ArticleTracker({ articleSlug, articleTitle }: ArticleTrackerProps) {
  const searchParams = useSearchParams();
  const trackedMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    // 1. Determine discovery source
    const querySource = searchParams.get("source") || searchParams.get("ref");
    const fromSlug = searchParams.get("from");

    let source = "direct";
    if (querySource) {
      source = querySource;
    } else if (fromSlug) {
      source = "related";
    } else if (typeof document !== "undefined" && document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        if (refUrl.origin === window.location.origin) {
          if (refUrl.pathname === "/") source = "homepage";
          else if (refUrl.pathname.startsWith("/categories")) source = "category";
          else if (refUrl.pathname.startsWith("/tags")) source = "tag";
          else if (refUrl.pathname.startsWith("/search")) source = "search";
          else if (refUrl.pathname.startsWith("/blog")) source = "internal";
        } else {
          source = refUrl.hostname.replace("www.", "");
        }
      } catch {
        source = "referral";
      }
    }

    // 2. Track article view after a short threshold (1.2 seconds) to avoid bouncing bots
    const timer = setTimeout(() => {
      trackArticleView({
        articleSlug,
        articleTitle,
        source,
        fromSlug: fromSlug || undefined,
      });
    }, 1200);

    // 3. Passive scroll depth observer for reading engagement milestones (25%, 50%, 75%, 90%)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight <= 0) return;

          const scrollPercent = Math.min(
            100,
            Math.max(0, Math.round((window.scrollY / docHeight) * 100))
          );

          const milestones: (25 | 50 | 75 | 90)[] = [25, 50, 75, 90];
          for (const m of milestones) {
            if (scrollPercent >= m && !trackedMilestones.current.has(m)) {
              trackedMilestones.current.add(m);
              trackReadingMilestone({
                articleSlug,
                readingProgress: m,
              });
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [articleSlug, articleTitle, searchParams]);

  return null;
}
