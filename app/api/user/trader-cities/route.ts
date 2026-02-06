import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  let q = req.nextUrl.searchParams.get("q");

  if (!q) return NextResponse.json([]);

  q = q.trim();

  if (q.length < 2 || q.length > 50) {
    return NextResponse.json([]);
  }

  const safePattern = /^[a-zA-Z\s]+$/;
  if (!safePattern.test(q)) {
    return NextResponse.json([]);
  }

  try {
    const cities = await prisma.user.findMany({
      where: {
        role: "TRADER",
        isActive: true,
        city: {
          contains: q,
          mode: "insensitive",
        },
      },
      distinct: ["city"],
      select: { city: true },
      take: 5,
    });

    return NextResponse.json(
      cities.map((c) => c.city).filter(Boolean)
    );
  } catch (err) {
    console.error("CITY_SEARCH_ERROR:", err);
    return NextResponse.json([], { status: 500 });
  }
}
