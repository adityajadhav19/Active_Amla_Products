import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: {
      isVisible: true,
      inStock: true,
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return Response.json(products);
}
