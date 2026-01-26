// app/api/trader/profile/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/* ---------------- UTILS ---------------- */
function isValidMapLink(url: string) {
  return (
    url.startsWith("https://www.google.com/maps") ||
    url.startsWith("https://maps.app.goo.gl")
  );
}

/* ---------------- GET PROFILE ---------------- */
export async function GET() {
  const user = await getAuthUser();

  if (!user || user.role !== "TRADER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      city: true,
      state: true,
      pincode: true,
      mapLink: true,
      addressLine1: true,
      addressLine2: true,
      
    },
  });

  if (!profile) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(profile);
}

/* ---------------- UPDATE PROFILE ---------------- */
export async function PATCH(req: Request) {
  const user = await getAuthUser();

  if (!user || user.role !== "TRADER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const updateData: Record<string, any> = {};

  /* ---- SAFE STRING FIELDS ---- */
  if (typeof body.addressLine1 === "string") {
    updateData.addressLine1 = body.addressLine1.trim();
  }

  if (typeof body.addressLine2 === "string") {
    updateData.addressLine2 = body.addressLine2.trim();
  }

  if (typeof body.city === "string") {
    updateData.city = body.city.trim();
  }

  if (typeof body.state === "string") {
    updateData.state = body.state.trim();
  }

  if (typeof body.phone === "string") {
    updateData.phone = body.phone.trim();
  }

  /* ---- PINCODE VALIDATION ---- */
  if (typeof body.pincode === "string") {
    if (!/^\d{6}$/.test(body.pincode)) {
      return NextResponse.json(
        { error: "Invalid pincode" },
        { status: 400 }
      );
    }
    updateData.pincode = body.pincode;
  }

  /* ---- MAP LINK VALIDATION ---- */
  if (typeof body.mapLink === "string") {
    const link = body.mapLink.trim();
    if (!isValidMapLink(link)) {
      return NextResponse.json(
        { error: "Invalid Google Maps link" },
        { status: 400 }
      );
    }
    updateData.mapLink = link;
  }

  /* ---- NOTHING TO UPDATE ---- */
  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  /* ---- UPDATE DB ---- */
  await prisma.user.update({
    where: { id: user.id },
    data: updateData,
  });

  return NextResponse.json({
    message: "Profile updated successfully",
  });
}
