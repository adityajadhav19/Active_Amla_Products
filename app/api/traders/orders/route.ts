import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/* ================== GET TRADER ORDERS ================== */
export async function GET() {
  const user = await getAuthUser();

  if (!user || user.role !== "TRADER") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const orders = await prisma.order.findMany({
    where: {
      traderId: user.id,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
      bill: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(orders);
}

/* ================== CREATE ORDER ================== */
export async function POST(req: Request) {
  const user = await getAuthUser();

  if (!user || user.role !== "TRADER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json(
      { error: "No items in order" },
      { status: 400 }
    );
  }

  const productIds = items.map((i: any) => i.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      wholesalePrice: true,
    },
  });

  const priceMap = new Map(
    products.map(p => [p.id, p.wholesalePrice])
  );

  const order = await prisma.order.create({
    data: {
      orderCode: `ORD-${Date.now()}`,
      traderId: user.id,
      status: "REQUESTED",
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: priceMap.get(item.productId)!,
        })),
      },
    },
  });

  return NextResponse.json(order);
}
