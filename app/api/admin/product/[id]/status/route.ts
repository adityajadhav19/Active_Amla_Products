import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  // 🔐 Admin validation
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ IMPORTANT: await params
  const params = await context.params;
  const productId = Number(params.id);

  if (Number.isNaN(productId)) {
    return NextResponse.json(
      { error: "Invalid product ID" },
      { status: 400 }
    );
  }

  const { isActive } = await req.json();

  if (typeof isActive !== "boolean") {
    return NextResponse.json(
      { error: "Invalid status value" },
      { status: 400 }
    );
  }

  await prisma.product.update({
    where: { id: productId },
    data: { isActive },
  });

  return NextResponse.json({ success: true });
}
