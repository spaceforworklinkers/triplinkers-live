import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow admin login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect all admin routes
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
