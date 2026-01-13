import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const productId = Number(params.id);

  const {
    name,
    description,
    imageUrl,
    retailPrice,
    wholesalePrice,
  } = await req.json();

  const slug = name.toLowerCase().replace(/\s+/g, "-");

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
}
