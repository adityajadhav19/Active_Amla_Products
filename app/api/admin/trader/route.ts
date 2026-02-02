import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(): Promise<Response> {
  const admin = await requireAdmin();

  // 🔐 Proper unauthorized response
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const traders = await prisma.user.findMany({
      where: { role: "TRADER" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(traders);
  } catch (error) {
    console.error("FETCH_TRADERS_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch traders" },
      { status: 500 }
    );
  }
}
