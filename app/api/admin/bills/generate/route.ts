// app/api/admin/bills/generate/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { csrfProtect } from "@/lib/csrf-protect"; // ✅ ADD

export async function POST(req: Request) {
  const user = await getAuthUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  
  try {
   await csrfProtect();
  } catch (error) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const {
    orderId,
    baseAmount,
    transportFee = 0,
    extraCharges = 0,
    discount = 0,
    notes,
  } = await req.json();

  if (!orderId || !baseAmount) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const totalAmount =
    baseAmount + transportFee + extraCharges - discount;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { bill: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.bill) {
    return NextResponse.json(
      { error: "Bill already exists for this order" },
      { status: 400 }
    );
  }

  const bill = await prisma.bill.create({
    data: {
      orderId,
      baseAmount,
      transportFee,
      extraCharges,
      discount,
      totalAmount,
      notes,
      status: "UNPAID",
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "PROCESSING" },
  });

  return NextResponse.json(bill, { status: 201 });
}
