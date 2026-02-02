import crypto from "crypto";

export function generateCSRFToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function verifyCSRFToken(
  cookieToken: string | undefined,
  headerToken: string | null
) {
  if (!cookieToken || !headerToken) return false;

  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(headerToken)
  );
}
