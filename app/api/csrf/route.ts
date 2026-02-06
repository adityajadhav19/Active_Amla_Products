// app/api/csrf/route.ts
import { issueCSRFToken } from "@/lib/csrf";

export async function GET() {
  const token = await issueCSRFToken();
  return Response.json({ token });
}
