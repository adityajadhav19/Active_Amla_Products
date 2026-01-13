import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.order.update({
    where: { id: Number(params.id) },
    data: { status: "APPROVED" },
  });

  return NextResponse.json({ success: true });
}
