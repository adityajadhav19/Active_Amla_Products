import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const RATE_LIMIT = new Map<string, number[]>();

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const windowMs = 60_000; // 1 minute
    const maxRequests = 5;

    const timestamps = RATE_LIMIT.get(ip) || [];
    const recent = timestamps.filter((t) => now - t < windowMs);

    if (recent.length >= maxRequests) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    recent.push(now);
    RATE_LIMIT.set(ip, recent);

    const { name, email, message, company } = await req.json();

    // 🐝 Honeypot check
    if (company) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await prisma.contactMessage.create({
      data: { name, email, message },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CONTACT_ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
