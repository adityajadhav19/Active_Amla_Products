import { cookies, headers } from "next/headers";
import { verifyCSRFToken } from "@/lib/csrf";

export async function csrfProtect(): Promise<void> {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieToken = cookieStore.get("csrf_token")?.value;
  const headerToken = headerStore.get("x-csrf-token");

  const valid = verifyCSRFToken(cookieToken, headerToken);

  if (!valid) {
    throw new Error("CSRF_TOKEN_INVALID");
  }
}
