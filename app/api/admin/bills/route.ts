// app/api/admin/bills/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { csrfProtect } from "@/lib/csrf-protect";
/* ---------------- GET ALL BILLS (ADMIN) ---------------- */

export async function GET() {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const bills = await prisma.bill.findMany({
    include: {
      order: {
        include: {
          trader: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bills);
}

/* ---------------- CREATE BILL (ADMIN) ---------------- */

export async function POST(req: Request) {
  
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await csrfProtect();
    const {
      orderId,
      baseAmount,
      transportFee = 0,
      extraCharges = 0,
      discount = 0,
      notes = "",
    } = await req.json();

    if (orderId == null || baseAmount == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const totalAmount =
      baseAmount + transportFee + extraCharges - discount;

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

    return NextResponse.json(
      { success: true, bill },
      { status: 201 }
    );
  } catch (error) {
    
    console.error("CREATE_BILL_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create bill" },
      { status: 500 }
    );
  }
}
