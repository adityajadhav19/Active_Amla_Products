import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getAuthUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, totalAmount } = await req.json();

  if (!orderId || !totalAmount) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      totalAmount,
      status: "APPROVED",
    },
  });

  return NextResponse.json(order);
}
