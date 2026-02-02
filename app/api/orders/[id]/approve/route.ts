export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  _: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    // 🔐 Proper admin check
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Next 15 params fix
    const { id } = await context.params;
    const orderId = Number(id);

    if (Number.isNaN(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: "APPROVED" },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("APPROVE_ORDER_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to approve order" },
      { status: 500 }
    );
  }
}
