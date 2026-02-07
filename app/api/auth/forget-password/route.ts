import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ success: true });

  const token = crypto.randomBytes(32).toString("hex");

  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 15),
    },
  });

  await resend.emails.send({
    from: "Active Products Support <info@activeproducts.in>",
    to: user.email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}">
        Reset Password
      </a>
      <p>This link expires in 15 minutes.</p>
    `,
  });

  return NextResponse.json({ success: true });
}
