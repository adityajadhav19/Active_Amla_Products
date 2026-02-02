import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    
    const { email, password } = await req.json();

    /* ---------------- VALIDATION ---------------- */
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    /* ---------------- FIND USER ---------------- */
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    /* ---------------- CHECK PASSWORD ---------------- */
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    /* ---------------- BLOCK INACTIVE USERS ---------------- */
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account disabled. Contact support." },
        { status: 403 }
      );
    }

    /* ---------------- CREATE JWT ---------------- */
    const token = createToken({
      id: user.id,
      role: user.role, // USER | TRADER | ADMIN
    });

    /* ---------------- SEND RESPONSE + COOKIE ---------------- */
    const res = NextResponse.json({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error("LOGIN_ERROR:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
