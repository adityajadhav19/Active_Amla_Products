import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export type TokenPayload = {
  id: number;
  role: "USER" | "TRADER" | "ADMIN";
};

const JWT_SECRET = process.env.JWT_SECRET!;

/* ================= CREATE TOKEN ================= */
export function createToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
}

/* ================= VERIFY TOKEN ONLY ================= */
/* Used by middleware or lightweight checks */
export async function verifyAuth(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

/* ================= GET FULL USER FROM DB ================= */
/* Used in API routes */
export async function getAuthUser() {
  try {
    const payload = await verifyAuth();
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || !user.isActive) return null;

    return user;
  } catch {
    return null;
  }
}

/* ================= REQUIRE ANY USER ================= */
export async function requireUser() {
  const user = await getAuthUser();
  if (!user) return null;
  return user;
}

/* ================= REQUIRE ADMIN ================= */
export async function requireAdmin() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

/* ================= REQUIRE TRADER ================= */
export async function requireTrader() {
  const user = await getAuthUser();
  if (!user || (user.role !== "TRADER" && user.role !== "ADMIN")) return null;
  return user;
}
