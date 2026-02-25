import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // This example protects all pages.
    // If a user is not authenticated, they will be redirected to the login page.
    // You can customize this logic to protect specific routes.
    // For example, to protect only /protected routes:
    if (!req.nextauth.token && req.nextUrl.pathname.startsWith("/protected")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Allow access to the API routes (login, register, nextauth)
    if (req.nextUrl.pathname.startsWith("/api/register") || req.nextUrl.pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/protected/:path*", "/api/register", "/api/auth/:path*"],
};
