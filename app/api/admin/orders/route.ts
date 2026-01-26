import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: {
      traderId: { not: null },
    },
    include: {
      trader: {
        select: {
          name: true,
          email: true,
          city: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
              wholesalePrice: true,
            },
          },
        },
      },
      bill: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}