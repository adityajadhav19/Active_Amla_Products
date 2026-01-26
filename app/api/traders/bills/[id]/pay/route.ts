export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  const user = await getAuthUser();

  if (!user || user.role !== "TRADER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const billId = Number(id);

  // Ensure bill belongs to this trader
  const bill = await prisma.bill.findUnique({
    where: { id: billId },
    include: {
      order: true,
    },
  });

  if (!bill || bill.order.traderId !== user.id) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const updatedBill = await prisma.bill.update({
    where: { id: billId },
    data: {
      status: "PAID",
      order: {
        update: {
          status: "PROCESSING",
        },
      },
    },
  });

  return NextResponse.json({ success: true, bill: updatedBill });
}
