import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const productId = Number(params.id);
  const { isActive } = await req.json();

  const product = await prisma.product.update({
    where: { id: productId },
    data: { isActive },
  });

  return NextResponse.json(product);
}
