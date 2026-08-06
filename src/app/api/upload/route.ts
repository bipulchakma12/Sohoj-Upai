import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided in request" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // If Cloudinary credentials are mock/placeholder, return a structured placeholder response gracefully
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName || cloudName.includes("your_cloudinary")) {
      return NextResponse.json({
        success: true,
        message: "Cloudinary credentials not configured yet. Returning placeholder image URL.",
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        filename: file.name,
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(base64File, {
      folder: "sohoj_upai_uploads",
    });

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json(
      { error: "Image upload failed", message: error.message },
      { status: 500 }
    );
  }
}
