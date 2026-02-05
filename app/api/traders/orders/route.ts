import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { csrfProtect } from "@/lib/csrf-protect";

const ORDER_STATUS = {
  REQUESTED: "REQUESTED",
} as const;

/* ================== TYPES ================== */
type OrderItemInput = {
  productId: number;
  quantity: number;
};

/* ================== GET TRADER ORDERS ================== */
export async function GET() {
  const user = await getAuthUser();

  if (!user || user.role !== "TRADER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { traderId: user.id },
    include: {
      items: {
        include: {
          product: {
            select: { name: true },
          },
        },
      },
      bill: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

/* ================== CREATE ORDER ================== */
export async function POST(req: Request) {
  try {
    await csrfProtect();
    const user = await getAuthUser();

    if (!user || user.role !== "TRADER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const items: OrderItemInput[] = body.items;

    /* 🛑 VALIDATION */
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No items in order" },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Invalid order item data" },
          { status: 400 }
        );
      }
    }

    /* 🔎 FETCH PRODUCTS */
    const productIds = items.map((i) => i.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        wholesalePrice: true,
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products not found" },
        { status: 400 }
      );
    }

    const priceMap = new Map<number, number>(
      products.map((p: { id: number; wholesalePrice: number }) => [p.id, p.wholesalePrice])
    );

    /* 🧾 CREATE ORDER */
    const order = await prisma.order.create({
      data: {
        orderCode: `ORD-${Date.now()}`,
        traderId: user.id,
        status: ORDER_STATUS.REQUESTED,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: priceMap.get(item.productId)!,
          })),
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("CREATE_ORDER_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
