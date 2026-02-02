import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { csrfProtect } from "@/lib/csrf-protect";
import { ratelimit } from "@/lib/rate-limit"; // use your existing limiter

export async function POST(req: Request) {
  try {
    /* ---------------- CSRF ---------------- */
    await csrfProtect();

    /* ---------------- REAL IP ---------------- */
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] ?? "anonymous";

    /* ---------------- RATE LIMIT ---------------- */
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    /* ---------------- BODY ---------------- */
    const { name, email, message, company } = await req.json();

    // 🐝 Honeypot
    if (company) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    /* ---------------- DB ---------------- */
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
