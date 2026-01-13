// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

type TokenPayload = {
  id: number;
  role: "USER" | "TRADER" | "ADMIN";
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  let user: TokenPayload | null = null;

  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
      user = null;
    }
  }

  /* ---------- PUBLIC ROUTES ---------- */
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/products",
  ];

  if (
    publicRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/api/auth")
  ) {
    // 🔒 Logged-in users should not see login/signup again
    if (
      user &&
      (pathname.startsWith("/login") || pathname.startsWith("/signup"))
    ) {
      return NextResponse.redirect(
        new URL(
          user.role === "ADMIN"
            ? "/admin/dashboard"
            : user.role === "TRADER"
            ? "/trader/dashboard"
            : "/user",
          req.url
        )
      );
    }

    return NextResponse.next();
  }

  /* ---------- ADMIN (FULL ACCESS) ---------- */
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin")
  ) {
    if (!user || user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  /* ---------- TRADER ---------- */
  if (
    pathname.startsWith("/trader") ||
    pathname.startsWith("/api/traders")
  ) {
    if (!user || (user.role !== "TRADER" && user.role !== "ADMIN")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  /* ---------- USER ---------- */
  if (pathname.startsWith("/user")) {
    if (!user || (user.role !== "USER" && user.role !== "ADMIN")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();

  /* ---------------- WHOLESALE / TRADER PRODUCTS ---------------- */
if (pathname.startsWith("/trader/products")) {
  if (!user || (user.role !== "TRADER" && user.role !== "ADMIN")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}



}

/* ---------- APPLY MIDDLEWARE ---------- */
export const config = {
  matcher: [
    "/admin/:path*",
    "/trader/:path*",
    "/user/:path*",
    "/api/admin/:path*",
    "/api/trader/:path*",
    "/trader/products/:path*", // ✅ important
  ],
};
