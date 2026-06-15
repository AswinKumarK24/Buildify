import { NextRequest, NextResponse } from "next/server";
import { JWT_COOKIE_NAME, verifyJwt } from "./src/lib/auth";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/api/auth/login", "/api/auth/logout"];
const ASSET_PATHS = ["/_next", "/favicon.ico", "/robots.txt", "/sitemap.xml"];

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const url = nextUrl.clone();
  const pathname = nextUrl.pathname;

  if (ASSET_PATHS.some((prefix) => pathname.startsWith(prefix)) || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const token = cookies.get(JWT_COOKIE_NAME)?.value;
  const session = token ? await verifyJwt(token) : null;

  const isPublicRoute = PUBLIC_PATHS.includes(pathname);

  if (!session && !isPublicRoute) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (session && pathname === "/login") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && session?.role !== "Admin") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
