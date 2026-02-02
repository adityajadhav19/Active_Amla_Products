import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

type TokenPayload = {
  id: number;
  role: "USER" | "TRADER" | "ADMIN";
};

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  let user: TokenPayload | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      user = payload as TokenPayload;
    } catch (err) {
      console.log("JWT verify failed:", err);
      user = null;
    }
  }

  const isPublic =
    pathname === "/" ||
    pathname === "/products" ||
    pathname.startsWith("/api/auth");

  if (pathname === "/login" || pathname === "/signup") {
    if (user) {
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

  if (isPublic) return NextResponse.next();

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!user || user.role !== "ADMIN")
      return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/trader") || pathname.startsWith("/api/traders")) {
    if (!user || (user.role !== "TRADER" && user.role !== "ADMIN"))
      return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/user")) {
    if (!user || (user.role !== "USER" && user.role !== "ADMIN"))
      return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
