"use client";

/**
 * First-Party, Privacy-Preserving Analytics Client for Frontend Expert.
 * 
 * Guarantees:
 * - Zero third-party scripts or external network calls.
 * - Anonymous, ephemeral session identifier (stored in sessionStorage).
 * - No PII, passwords, authentication tokens, or personal identifiers collected.
 * - Non-blocking: Uses navigator.sendBeacon or fetch with keepalive.
 * - In-memory and session-storage deduplication to prevent view spamming.
 */

const SESSION_KEY = "fe_analytics_session_id";
const VIEWED_SLUGS_KEY = "fe_viewed_articles";

/**
 * Retrieves or generates an ephemeral anonymous session identifier.
 * Stored in sessionStorage so it expires when the tab/browser is closed.
 */
export function getAnonymousSessionId(): string {
  if (typeof window === "undefined") return "";

  try {
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = `sess_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return "anonymous_session";
  }
}

/**
 * Determines device category from user agent in a coarse, privacy-safe way.
 */
function getDeviceCategory(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
}

/**
 * Dispatches an event payload to /api/analytics/track without blocking execution.
 */
function dispatchEvent(eventData: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({
    ...eventData,
    sessionId: getAnonymousSessionId(),
    device: getDeviceCategory(),
    timestamp: new Date().toISOString(),
  });

  try {
    // 1. Prefer navigator.sendBeacon for true non-blocking reliability (e.g. during page unloads)
    if (typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      const sent = navigator.sendBeacon("/api/analytics/track", blob);
      if (sent) return;
    }

    // 2. Fallback to fetch with keepalive
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Intentionally silent: Analytics must never disrupt user experience or surface UI errors
    });
  } catch {
    // Silent fail
  }
}

/**
 * Tracks an article view with client-side deduplication.
 */
export function trackArticleView(params: {
  articleSlug: string;
  articleTitle?: string;
  source?: string;
  fromSlug?: string;
  readingProgress?: number;
}) {
  if (typeof window === "undefined" || !params.articleSlug) return;

  // Deduplicate rapid refresh/re-render views in current session
  try {
    const rawCache = sessionStorage.getItem(VIEWED_SLUGS_KEY);
    const cache: Record<string, number> = rawCache ? JSON.parse(rawCache) : {};
    const now = Date.now();
    const lastViewed = cache[params.articleSlug];

    // If viewed within last 15 minutes and this is not a progress milestone update, skip view event
    if (lastViewed && now - lastViewed < 15 * 60 * 1000 && !params.readingProgress) {
      return;
    }

    cache[params.articleSlug] = now;
    sessionStorage.setItem(VIEWED_SLUGS_KEY, JSON.stringify(cache));
  } catch {
    // Continue even if sessionStorage is blocked
  }

  dispatchEvent({
    eventType: "ARTICLE_VIEW",
    articleSlug: params.articleSlug,
    articleTitle: params.articleTitle,
    source: params.source || "direct",
    fromSlug: params.fromSlug,
    readingProgress: params.readingProgress,
  });
}

/**
 * Tracks reading milestone updates (e.g. 25%, 50%, 75%, 90%).
 */
export function trackReadingMilestone(params: {
  articleSlug: string;
  readingProgress: 25 | 50 | 75 | 90;
}) {
  if (typeof window === "undefined" || !params.articleSlug) return;

  dispatchEvent({
    eventType: "READING_PROGRESS",
    articleSlug: params.articleSlug,
    readingProgress: params.readingProgress,
  });
}

/**
 * Tracks search query execution and click selection.
 */
export function trackSearchEvent(params: {
  query: string;
  resultCount: number;
  clickedSlug?: string;
}) {
  if (typeof window === "undefined") return;
  const trimmed = params.query.trim().toLowerCase();
  if (!trimmed) return;

  dispatchEvent({
    eventType: "SEARCH",
    query: trimmed,
    resultCount: Math.max(0, params.resultCount),
    clickedSlug: params.clickedSlug,
  });
}

/**
 * Tracks discovery clicks (e.g., related articles, category tags, homepage cards).
 */
export function trackDiscoveryClick(params: {
  type: "CATEGORY_CLICK" | "TAG_CLICK" | "RELATED_CLICK" | "HOMEPAGE_CLICK";
  target: string;
  fromSlug?: string;
}) {
  if (typeof window === "undefined" || !params.target) return;

  dispatchEvent({
    eventType: "DISCOVERY_CLICK",
    discoveryType: params.type,
    target: params.target,
    fromSlug: params.fromSlug,
  });
}
