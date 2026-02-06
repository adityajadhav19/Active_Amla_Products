// app/api/products/featured/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        inStock: true,
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("FEATURED_PRODUCTS_ERROR:", error);
    return NextResponse.json([], { status: 200 }); // 👈 don't break homepage
  }
}
