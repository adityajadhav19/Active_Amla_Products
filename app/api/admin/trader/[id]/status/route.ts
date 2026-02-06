// app/api/admin/trader/[id]/status/route.ts
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { csrfProtect } from "@/lib/csrf-protect";



export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> } // ✅ Next 15 fix
): Promise<Response> {
  await csrfProtect();
  const admin = await requireAdmin();

  // 🔒 Proper Response return
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const traderId = Number(id);

    if (Number.isNaN(traderId)) {
      return NextResponse.json(
        { error: "Invalid trader ID" },
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

    const trader = await prisma.user.update({
      where: { id: traderId },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      message: "Trader status updated",
      trader,
    });

  } catch (error) {
    console.error("TRADER_STATUS_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update trader status" },
      { status: 500 }
    );
  }
}
