import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const cities = await prisma.user.findMany({
    where: {
      role: "TRADER",
      city: {
        contains: q,
        mode: "insensitive", // ✅
      },
      isActive: true,
    },
    distinct: ["city"],
    select: {
      city: true,
    },
    take: 5,
  });

  return NextResponse.json(cities.map(c => c.city));
}
