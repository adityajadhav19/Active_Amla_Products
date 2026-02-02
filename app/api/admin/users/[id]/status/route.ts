import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const admin = await requireAdmin();

  // 🔐 Proper auth response
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // ✅ Next 15 param handling
    const { id } = await context.params;
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const { isActive } = await req.json();

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("USER_STATUS_UPDATE_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    );
  }
}
