import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { ratelimit } from "@/lib/rate-limit";

/* ---------------- VALIDATION SCHEMA ---------------- */
const signupSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  phone: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
});

/* ---------------- PASSWORD STRENGTH CHECK ---------------- */
function isStrongPassword(password: string) {
  return /[A-Z]/.test(password) &&     // capital
         /[a-z]/.test(password) &&     // small
         /[0-9]/.test(password) &&     // number
         /[^A-Za-z0-9]/.test(password); // special char
}

export async function POST(req: Request) {
  try {
    /* ---------------- RATE LIMIT ---------------- */
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] ?? "anonymous";

    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }

    /* ---------------- PARSE BODY ---------------- */
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { name, email, password, phone, city } = parsed.data;

    /* ---------------- PASSWORD STRENGTH ---------------- */
    if (!isStrongPassword(password)) {
      return NextResponse.json(
        { error: "Password must include upper, lower, number & special char" },
        { status: 400 }
      );
    }

    /* ---------------- DUPLICATE EMAIL CHECK ---------------- */
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // Prevent email enumeration timing attack
    if (existingUser) {
      await bcrypt.compare(password, "$2a$10$invalidsaltstringinvalidsaltst");
      return NextResponse.json(
        { error: "Signup failed" },
        { status: 400 }
      );
    }

    /* ---------------- HASH PASSWORD ---------------- */
    const hashedPassword = await bcrypt.hash(password, 12);

    /* ❗ FORCE SAFE ROLE */
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        password: hashedPassword,
        role: "USER",   // 🚨 user CANNOT choose role
        city: city ?? null,
        isActive: true,
      },
    });

    return NextResponse.json(
      { message: "Signup successful" },
      { status: 201 }
    );
  } catch (err) {
    console.error("SIGNUP_ERROR:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
