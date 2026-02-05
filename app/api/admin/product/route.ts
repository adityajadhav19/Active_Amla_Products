export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { csrfProtect } from "@/lib/csrf-protect";

/* ================= GET PRODUCTS ================= */
export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error("GET_PRODUCTS_ERROR:", err);
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 }
    );
  }
}

/* ================= CREATE PRODUCT ================= */
export async function POST(req: Request) {
  try {
    /* 🔒 CSRF FIRST */
    await csrfProtect();

    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, retailPrice, wholesalePrice, imageUrl } =
      await req.json();

    /* 🔐 VALIDATION */
    if (!name || !retailPrice || !wholesalePrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* 🧠 SLUG GENERATION */
    function generateSlug(text: string) {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let count = 1;

    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    /* 💾 CREATE */
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        retailPrice: Number(retailPrice),
        wholesalePrice: Number(wholesalePrice),
        imageUrl,
        isActive: true,
        inStock: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("CREATE_PRODUCT_ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
