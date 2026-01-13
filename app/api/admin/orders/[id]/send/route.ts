import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = Number(params.id);
    const { trackingId } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // 🔒 State protection
    if (order.status !== OrderStatus.APPROVED) {
      return NextResponse.json(
        { error: "Only APPROVED orders can be sent" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.SENT,
        trackingId: trackingId || null,
        sentAt: new Date(),
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("MARK_SENT_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to mark order as sent" },
      { status: 500 }
    );
  }
}
