//api/admin/product/route.ts

import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const {
    name,
    description,
    imageUrl,
    retailPrice,
    wholesalePrice,
  } = await req.json();

  if (!name || !retailPrice || !wholesalePrice) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      imageUrl,
      retailPrice,
      wholesalePrice,
      isActive: true,
    },
  });

  return NextResponse.json(product);
}
