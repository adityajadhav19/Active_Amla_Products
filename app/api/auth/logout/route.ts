import { NextResponse } from "next/server";
import { csrfProtect } from "@/lib/csrf-protect";

export async function POST(): Promise<Response> {
  try {
    // 🔐 Prevent cross-site logout attacks
    await csrfProtect();

    const res = NextResponse.json({ success: true });

    // 🍪 Clear auth cookie
    res.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid CSRF token" },
      { status: 403 }
    );
  }
}
