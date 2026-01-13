// lib/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export type AuthUser = {
  id: number;
  name: string;
  role: "USER" | "TRADER" | "ADMIN";
};

type TokenPayload = {
  id: number;
  role: "USER" | "TRADER" | "ADMIN";
};

export function createToken(payload: TokenPayload) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET missing");
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      name: user.name,
      role: user.role,
    };
  } catch {
    return null;
  }
}

export async function verifyAdmin() {
  const user = await getAuthUser();
  return user?.role === "ADMIN";
}

export async function verifyTrader() {
  const user = await getAuthUser();
  return user?.role === "TRADER";
}
