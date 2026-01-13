// app/api/admin/messages/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!verifyAdmin(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await context.params; // ✅ UNWRAP PROMISE
  const messageId = Number(id);

  if (isNaN(messageId)) {
    return new Response("Invalid message id", { status: 400 });
  }

  await prisma.contactMessage.delete({
    where: { id: messageId },
  });

  return new Response(null, { status: 204 });
}
