import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Next.js 15 correct way
    const params = await context.params;
    const traderId = Number(params.id);

    if (isNaN(traderId)) {
      return NextResponse.json(
        { error: "Invalid trader ID" },
        { status: 400 }
      );
    }

    const { isActive } = await req.json();

    const trader = await prisma.user.update({
      where: { id: traderId },
      data: { isActive },
    });

    return NextResponse.json({
      message: "Trader status updated successfully",
      trader,
    });
  } catch (error) {
    console.error("TRADER_STATUS_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update trader status" },
      { status: 500 }
    );
  }
}
