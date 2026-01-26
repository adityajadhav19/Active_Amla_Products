import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city");

  if (!city) {
    return NextResponse.json([], { status: 200 });
  }

  const traders = await prisma.user.findMany({
    where: {
      role: "TRADER",
      city: {
        equals: city,
        mode: "insensitive", // ✅ FIX
      },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      city: true,
      addressLine1: true,
      mapLink: true,
    },
  });

  return NextResponse.json(traders);
}
