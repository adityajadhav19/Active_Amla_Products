import { cookies } from "next/headers";
import { headers } from "next/headers";
import { verifyCSRFToken } from "@/lib/csrf";

export async function csrfProtect(): Promise<void> {
  // cookies() is sync
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("csrf_token")?.value;

  // headers() is async in your Next version
  const headerStore = await headers();
  const headerToken = headerStore.get("x-csrf-token");

  const valid = verifyCSRFToken(cookieToken, headerToken);

  if (!valid) {
    throw new Error("CSRF_TOKEN_INVALID");
  }
}
