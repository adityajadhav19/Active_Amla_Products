import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const rawSecret = process.env.JWT_SECRET;

if (!rawSecret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// 👇 This makes TypeScript happy forever
const JWT_SECRET: string = rawSecret;

export type AuthUser = {
  id: number;
  name: string;
  role: "USER" | "TRADER" | "ADMIN";
  isActive: boolean;
};

/* ---------------- CREATE TOKEN ---------------- */
export function createToken(payload: {
  id: number;
  role: "USER" | "TRADER" | "ADMIN";
}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/* ---------------- GET AUTH USER ---------------- */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;

    // 🔒 Runtime validation of token payload
    if (
      typeof decoded !== "object" ||
      typeof decoded.id !== "number" ||
      !["USER", "TRADER", "ADMIN"].includes(decoded.role as string)
    ) {
      return null;
    }

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

    return user;
  } catch (err) {
    console.error("AUTH_ERROR:", err);
    return null;
  }
}

/* ---------------- ROLE GUARDS ---------------- */
export async function requireAdmin(): Promise<AuthUser | null> {
  const user = await getAuthUser();
  return user?.role === "ADMIN" ? user : null;
}

export async function requireTrader(): Promise<AuthUser | null> {
  const user = await getAuthUser();
  return user?.role === "TRADER" ? user : null;
}

export async function requireUser(): Promise<AuthUser | null> {
  const user = await getAuthUser();
  return user?.role === "USER" ? user : null;
}
