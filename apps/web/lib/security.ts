import { NextRequest } from "next/server";

/**
 * Validates request origin and referer to prevent CSRF attacks.
 */
export function verifyCSRF(request: NextRequest): boolean {
  // Safe methods do not require CSRF checks
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(request.method)) {
    return true;
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const hostHeader = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";

  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (process.env.NODE_ENV === "development" && originUrl.hostname === "localhost") {
        return true;
      }
      if (
        originUrl.host === hostHeader ||
        hostHeader.includes(originUrl.host) ||
        originUrl.host.includes(hostHeader)
      ) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (process.env.NODE_ENV === "development" && refererUrl.hostname === "localhost") {
        return true;
      }
      if (
        refererUrl.host === hostHeader ||
        hostHeader.includes(refererUrl.host) ||
        refererUrl.host.includes(hostHeader)
      ) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Fallback to true in development if headers are missing (e.g. Server Component fetches or scripts),
  // but block in production for mutations.
  return process.env.NODE_ENV === "development";
}

// Memory-based rate limiter store
const ipCache = new Map<string, { count: number; resetTime: number }>();

// Cleanup stale cache entries periodically (every 10 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipCache.entries()) {
      if (now > record.resetTime) {
        ipCache.delete(ip);
      }
    }
  }, 10 * 60 * 1000);
}

/**
 * A basic memory rate limiter to protect sensitive endpoints (e.g. login).
 */
export function checkRateLimit(
  ip: string,
  limit = 10,
  windowMs = 60 * 1000
): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const record = ipCache.get(ip);

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    ipCache.set(ip, { count: 1, resetTime });
    return { success: true, limit, remaining: limit - 1, reset: resetTime };
  }

  if (record.count >= limit) {
    return { success: false, limit, remaining: 0, reset: record.resetTime };
  }

  record.count++;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}
