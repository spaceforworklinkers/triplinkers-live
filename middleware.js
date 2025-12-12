import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes (except /admin/login)
  const isAdminRoute =
    pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // Read token from cookies
  const token = req.cookies.get("admin_session")?.value;

  if (!token) {
    // redirect to login
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
