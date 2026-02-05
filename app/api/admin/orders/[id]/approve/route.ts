// app/api/admin/orders/[id]/approve/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

const ORDER_STATUSES = {
  REQUESTED: "REQUESTED",
  APPROVED: "APPROVED",
} as const;



export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const orderId = Number(id);

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order || order.status !== ORDER_STATUSES.REQUESTED) {
    return NextResponse.json(
      { error: "Only REQUESTED orders can be approved" },
      { status: 400 }
    );
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: ORDER_STATUSES.APPROVED },
  });

  return NextResponse.json({ success: true });
}
