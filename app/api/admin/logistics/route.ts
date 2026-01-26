import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return 401;

  try {
    console.log("LOGISTICS API HIT");

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { status: OrderStatus.APPROVED },
          { status: OrderStatus.DISPATCHED },
        ],
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("LOGISTICS_FETCH_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch logistics orders" },
      { status: 500 }
    );
  }
}
