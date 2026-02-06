export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";          // ❗ MISSING IMPORT
import { requireAdmin } from "@/lib/auth";
import { csrfProtect } from "@/lib/csrf-protect";

const ORDER_STATUSES = {
  REQUESTED: "REQUESTED",
  APPROVED: "APPROVED",
} as const;

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    // 🔐 CSRF FIRST
    await csrfProtect();

    // 🔐 AUTH SECOND
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🧩 Params (Next 15 style)
    const { id } = await context.params;
    const orderId = Number(id);

    if (!orderId || Number.isNaN(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      );
    }

    // 🛑 Ensure order exists before update (better error)
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // 🔁 Prevent double approval
    if (existingOrder.status === ORDER_STATUSES.APPROVED) {
      return NextResponse.json(
        { message: "Order already approved" },
        { status: 200 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: ORDER_STATUSES.APPROVED },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("APPROVE_ORDER_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to approve order" },
      { status: 500 }
    );
  }
}
