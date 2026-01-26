import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const productId = Number(params.id);
  if (Number.isNaN(productId)) {
    return NextResponse.json(
      { error: "Invalid product ID" },
      { status: 400 }
    );
  }

  const body = await req.json();

  const name = body.name?.trim();
  const description = body.description ?? null;
  const imageUrl = body.imageUrl ?? null;

  const retailPrice = Number(body.retailPrice);
  const wholesalePrice = Number(body.wholesalePrice);

  if (
    !name ||
    Number.isNaN(retailPrice) ||
    Number.isNaN(wholesalePrice)
  ) {
    return NextResponse.json(
      { error: "Invalid or missing fields" },
      { status: 400 }
    );
  }

  const slug = name.toLowerCase().replace(/\s+/g, "-");

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        slug,
        description,
        imageUrl,
        retailPrice,
        wholesalePrice,
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.error("UPDATE_PRODUCT_ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
