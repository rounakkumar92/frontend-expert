import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptSession } from "@/lib/auth";
import { verifyCSRF } from "@/lib/security";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Verify CSRF for mutation requests
  if (pathname.startsWith("/api/")) {
    if (!verifyCSRF(request)) {
      return new NextResponse(
        JSON.stringify({ error: "CSRF token mismatch or invalid origin" }),
        { status: 403, headers: { "content-type": "application/json" } }
      );
    }
  }

  // 2. Protect Admin dashboard routes (except admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get("__session")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const session = await decryptSession(sessionCookie);

    if (!session || (session.role !== "ADMIN" && session.role !== "AUTHOR")) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Protect Admin API endpoints
  if (pathname.startsWith("/api/admin")) {
    const sessionCookie = request.cookies.get("__session")?.value;

    if (!sessionCookie) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized: Missing session token" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    const session = await decryptSession(sessionCookie);

    if (!session || (session.role !== "ADMIN" && session.role !== "AUTHOR")) {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden: Insufficient privileges" }),
        { status: 403, headers: { "content-type": "application/json" } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
