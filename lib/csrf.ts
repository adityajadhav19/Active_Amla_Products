import crypto from "crypto";
import { cookies } from "next/headers";

/* -------- GENERATE TOKEN -------- */
export function generateCSRFToken() {
  return crypto.randomBytes(32).toString("hex");
}

/* -------- ISSUE COOKIE -------- */
export async function issueCSRFToken() {
  const token = generateCSRFToken();

  (await cookies()).set("csrf_token", token, {
    httpOnly: false, // frontend must read
    secure: process.env.NODE_ENV === "production", // 🔥 REQUIRED for Vercel
    sameSite: "lax",
    path: "/",
  });

  return token;
}

/* -------- VERIFY -------- */
export function verifyCSRFToken(
  cookieToken: string | undefined,
  headerToken: string | null
) {
  if (!cookieToken || !headerToken) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken),
      Buffer.from(headerToken)
    );
  } catch {
    return false;
  }
}
