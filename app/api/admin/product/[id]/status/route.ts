import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> } // ✅ Next 15 correct type
) {
  // 🔐 Admin validation
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ MUST await params
  const { id } = await context.params;
  const productId = Number(id);

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

  try {
    await prisma.product.update({
      where: { id: productId },
      data: { isActive },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PRODUCT_STATUS_UPDATE_ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
