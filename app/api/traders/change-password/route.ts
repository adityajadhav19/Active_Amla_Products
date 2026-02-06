// app/api/traders/change-password/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { csrfProtect } from "@/lib/csrf-protect";

export async function POST(req: Request): Promise<Response> {
  try {
    // 🔐 CSRF FIRST
    await csrfProtect();

    // 🔐 AUTH SECOND
    const user = await getAuthUser();
    if (!user || user.role !== "TRADER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const trader = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    });

    if (!trader) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(oldPassword, trader.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Old password is incorrect" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    // 🚪 Force logout after password change
    const res = NextResponse.json({ success: true });
    res.cookies.set("auth_token", "", {
      maxAge: 0,
      path: "/",
    });

    return res;

  } catch (error) {
    console.error("CHANGE_PASSWORD_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
