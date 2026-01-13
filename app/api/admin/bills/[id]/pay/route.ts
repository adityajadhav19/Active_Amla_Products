import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";


export async function GET() {
  const user = await getAuthUser(); // ✅ await

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

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.bill.update({
    where: { id: Number(params.id) },
    data: { status: "PAID" },
  });

  return NextResponse.json({ success: true });
}
