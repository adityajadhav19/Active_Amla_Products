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

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/* ---------------- POST ---------------- */

export async function POST(req: Request) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await csrfProtect();
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Invalid file" },
        { status: 400 }
      );
    }

    /* ---------- VALIDATIONS ---------- */

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WEBP images are allowed" },
        { status: 400 }
      );
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      return NextResponse.json(
        { error: "File size must be under 5MB" },
        { status: 400 }
      );
    }

    /* ---------- UPLOAD ---------- */

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

   const uploadResult: UploadApiResponse = await new Promise(
  (resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "active-products/products",
          resource_type: "image",
        },
        (error: Error | undefined, result?: UploadApiResponse) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload failed"));
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
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
