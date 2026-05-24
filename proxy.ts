import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = [
  "/workspace",
  "/events",
  "/calendar",
  "/polls",
  "/analytics",
  "/templates",
];
const authRoutes = ["/login"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const sessionCookie = getSessionCookie(request);

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isLanding = pathname === "/";

  if (isProtected && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  if (isLanding && sessionCookie) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/workspace/:path*",
    "/events/:path*",
    "/calendar/:path*",
    "/polls/:path*",
    "/analytics/:path*",
    "/templates/:path*",
  ],
};
