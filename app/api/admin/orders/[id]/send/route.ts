// app/api/admin/orders/[id]/send/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const ORDER_STATUS = {
  PROCESSING: "PROCESSING",
  DISPATCHED: "DISPATCHED",
} as const;

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const orderId = Number(id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Dispatch only from PROCESSING
    if (order.status !== ORDER_STATUS.PROCESSING) {
      return NextResponse.json(
        { error: "Order must be PROCESSING before dispatch" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: ORDER_STATUS.DISPATCHED },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("DISPATCH_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to mark order as dispatched" },
      { status: 500 }
    );
  }
}
