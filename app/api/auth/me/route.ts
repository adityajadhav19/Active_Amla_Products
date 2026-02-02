// app/api/auth/me/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await verifyAuth(); // 🔐 central auth logic

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
