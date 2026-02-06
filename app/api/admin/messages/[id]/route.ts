import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { csrfProtect } from "@/lib/csrf-protect";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await csrfProtect(); 
  const admin = await requireAdmin(); // ✅ await + no req

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const messageId = Number(id);

  if (isNaN(messageId)) {
    return NextResponse.json({ error: "Invalid message id" }, { status: 400 });
  }

  await prisma.contactMessage.delete({
    where: { id: messageId },
  });

  return NextResponse.json({ success: true });
}
