// app/api/admin/product/[id]/status/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> } // ✅ Next 15 fix
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // ✅ MUST await params
    const { id } = await context.params;
    const traderId = Number(id);

    if (Number.isNaN(traderId)) {
      return NextResponse.json(
        { error: "Invalid trader ID" },
        { status: 400 }
      );
    }

    const { name, email, phone } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const trader = await prisma.user.update({
      where: { id: traderId },
      data: {
        name,
        email,
        phone: phone || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      message: "Trader updated successfully",
      trader,
    });
  } catch (error) {
    console.error("EDIT_TRADER_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update trader" },
      { status: 500 }
    );
  }
}
