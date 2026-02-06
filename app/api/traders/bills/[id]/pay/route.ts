export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { csrfProtect } from "@/lib/csrf-protect"; 
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  await csrfProtect(); 
  try {
    const user = await getAuthUser();

    if (!user || user.role !== "TRADER") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Next 15 params fix
    const { id } = await context.params;
    const billId = Number(id);

    if (Number.isNaN(billId)) {
      return NextResponse.json(
        { error: "Invalid bill ID" },
        { status: 400 }
      );
    }

    // 🔍 Ensure bill belongs to trader
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: { order: true },
    });

    if (!bill || bill.order.traderId !== user.id) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // 💰 Mark paid + move order to processing
    const updatedBill = await prisma.bill.update({
      where: { id: billId },
      data: {
        status: "PAID",
        order: {
          update: { status: "PROCESSING" },
        },
      },
    });

    return NextResponse.json({ success: true, bill: updatedBill });
  } catch (error) {
    console.error("TRADER_PAY_BILL_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update bill" },
      { status: 500 }
    );
  }
}
