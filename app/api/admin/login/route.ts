import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Find admin
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return Response.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 2️⃣ Verify password
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return Response.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3️⃣ Create JWT
    const token = jwt.sign(
      { role: "admin", adminId: admin.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // 4️⃣ Return token
    return Response.json({ token });
  } catch (error) {
    console.error("Admin login error:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

