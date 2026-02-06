import crypto from "crypto";
import { cookies } from "next/headers";

/* ---------------- GENERATE TOKEN ---------------- */
export function generateCSRFToken(): string {
  // 32 bytes → 64 char hex string
  return crypto.randomBytes(32).toString("hex");
}

/* ---------------- ISSUE COOKIE ---------------- */
export async function issueCSRFToken(): Promise<string> {
  const token = generateCSRFToken();

  const cookieStore = await cookies();

  cookieStore.set("csrf_token", token, {
    httpOnly: false, // frontend must read it to send header
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return token;
}

/* ---------------- VERIFY TOKEN ---------------- */
export function verifyCSRFToken(
  cookieToken: string | undefined,
  headerToken: string | null
): boolean {
  // Must exist
  if (!cookieToken || !headerToken) return false;

  // Must be same length for timingSafeEqual
  if (cookieToken.length !== headerToken.length) return false;

  try {
    // 🔥 IMPORTANT: Tokens are HEX strings → compare as hex bytes
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken, "hex"),
      Buffer.from(headerToken, "hex")
    );
  } catch {
    return false;
  }
}
