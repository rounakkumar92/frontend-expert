/**
 * Resolves the active site URL dynamically based on environment variables.
 * Priority order:
 * 1. NEXT_PUBLIC_SITE_URL (e.g. custom domain)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (Vercel canonical production URL)
 * 3. VERCEL_URL (Vercel deployment host)
 * 4. Default fallback: https://frontend-expert-web.vercel.app
 */
export function getSiteUrl(): string {
  // 1. Authoritative custom domain when explicitly configured
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = process.env.NEXT_PUBLIC_SITE_URL.trim();
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url.replace(/\/$/, "");
    }
    return `https://${url.replace(/\/$/, "")}`;
  }

  // 2. Vercel canonical production domain
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }

  // 3. Vercel deployment host (preview / branch deployments)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  // 4. Development environment fallback
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return "https://frontend-expert-web.vercel.app";
}
