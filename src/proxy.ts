import { auth } from "@/lib/auth";

export const proxy = auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api/auth (the Auth.js handler)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
