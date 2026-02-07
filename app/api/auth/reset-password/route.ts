import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (password.length < 8) {
    return NextResponse.json({ error: "Password too short" }, { status: 400 });
  }

  const reset = await prisma.passwordReset.findUnique({ where: { token } });
  if (!reset || reset.expiresAt < new Date())
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: reset.userId },
    data: { password: hashed },
  });

  await prisma.passwordReset.delete({ where: { token } });

  return NextResponse.json({ success: true });
}
