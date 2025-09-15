import { validateAdminToken } from "@/lib/auth"
import { NextResponse } from "next/server"



const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB for Cloudinary
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]

export async function POST(request) {
  const { default: cloudinary } = await import("@/lib/cloudinary");
  if (!validateAdminToken(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "vh-news", // Organize uploads in a folder
            transformation: [
              { width: 1200, height: 800, crop: "limit" }, // Limit max size
              { quality: "auto" }, // Auto optimize quality
              { fetch_format: "auto" }, // Auto format (WebP when supported)
            ],
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )
        .end(buffer)
    })

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      size: uploadResult.bytes,
      format: uploadResult.format,
    })
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

// Optional: Add DELETE endpoint to remove images from Cloudinary
export async function DELETE(request) {
  if (!validateAdminToken(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get("public_id")

    if (!publicId) {
      return NextResponse.json({ error: "No public_id provided" }, { status: 400 })
    }

    const result = await cloudinary.uploader.destroy(publicId)

    return NextResponse.json({
      success: true,
      result: result.result,
    })
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
