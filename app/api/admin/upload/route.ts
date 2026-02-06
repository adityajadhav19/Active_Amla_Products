import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { UploadApiResponse } from "cloudinary";
import { csrfProtect } from "@/lib/csrf-protect";

export async function POST(req: Request) {
   const admin = await requireAdmin();
    try {
      await csrfProtect();
    } catch {
      return NextResponse.json(
        { error: "CSRF token missing or invalid" },
        { status: 403 }
      );
    }
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

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

  return Response.json({ url: uploadResult.secure_url });
}
