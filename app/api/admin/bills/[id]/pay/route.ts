// app/api/admin/bills/[id]/pay/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/* ================= GET ALL BILLS (ADMIN) ================= */
export async function GET() {
  const user = await getAuthUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bills = await prisma.bill.findMany({
    include: {
      order: {
        select: {
          orderCode: true,
          trader: { select: { name: true, email: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bills);
}

/* ================= MARK BILL AS PAID ================= */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> } // ✅ NEXT 15 FIX
) {
  const user = await getAuthUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ MUST await params in Next 15
  const { id } = await context.params;
  const billId = Number(id);

  if (Number.isNaN(billId)) {
    return NextResponse.json({ error: "Invalid bill ID" }, { status: 400 });
  }

  const bill = await prisma.bill.findUnique({
    where: { id: billId },
  });

  if (!bill) {
    return NextResponse.json({ error: "Bill not found" }, { status: 404 });
  }

  if (bill.status === "PAID") {
    return NextResponse.json({ error: "Bill already paid" }, { status: 400 });
  }

  await prisma.bill.update({
    where: { id: billId },
    data: { status: "PAID" },
  });

  return NextResponse.json({ success: true });
}
