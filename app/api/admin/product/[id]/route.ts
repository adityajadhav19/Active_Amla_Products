import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { csrfProtect } from "@/lib/csrf-protect";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await csrfProtect();
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

 

  const { id } = await context.params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const body = await req.json();

  const name = body.name?.trim();
  const description = body.description ?? null;
  const imageUrl = body.imageUrl ?? null;
  const retailPrice = Number(body.retailPrice);
  const wholesalePrice = Number(body.wholesalePrice);

  if (!name || Number.isNaN(retailPrice) || Number.isNaN(wholesalePrice)) {
    return NextResponse.json(
      { error: "Invalid or missing fields" },
      { status: 400 }
    );
  }

  /* ---------------- SLUG GENERATION (SAFE) ---------------- */
  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  let baseSlug = generateSlug(name);
  let slug = baseSlug;
  let count = 1;

  // avoid slug collision with other products
  while (
    await prisma.product.findFirst({
      where: { slug, NOT: { id: productId } },
    })
  ) {
    slug = `${baseSlug}-${count++}`;
  }

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
