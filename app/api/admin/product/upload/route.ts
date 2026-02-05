// app/api/admin/product/upload/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { UploadApiResponse } from "cloudinary";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/lib/auth";
import { csrfProtect } from "@/lib/csrf-protect";

/* ---------------- CLOUDINARY CONFIG ---------------- */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/* ---------------- CONSTANTS ---------------- */

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/* ---------------- POST ---------------- */

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

 

  try {
    await csrfProtect();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    /* ---------- VALIDATIONS ---------- */

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WEBP images allowed" },
        { status: 400 }
      );
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      return NextResponse.json(
        { error: "File must be under 2MB" },
        { status: 400 }
      );
    }

    /* ---------- UPLOAD TO CLOUDINARY ---------- */
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Upload timeout")), 15000);

        cloudinary.uploader
          .upload_stream(
            {
              folder: "active-products/products",
              resource_type: "image",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
              clearTimeout(timeout);
              if (error || !result) return reject(error || new Error("Upload failed"));
              resolve(result);
            }
          )
          .end(buffer);
      }
    );

    return NextResponse.json({
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

  } catch (error) {
    console.error("UPLOAD_ERROR:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
