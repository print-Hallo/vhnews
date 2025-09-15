import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")

export async function GET(request, { params }) {
  try {
    const filePath = path.join(UPLOADS_DIR, ...params.path)

    // Security check: ensure the resolved path is within uploads directory
    const resolvedPath = path.resolve(filePath)
    const resolvedUploadsDir = path.resolve(UPLOADS_DIR)

    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Check if file exists
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Read and serve the file
    const fileBuffer = await fs.readFile(filePath)
    const filename = path.basename(filePath)
    const extension = path.extname(filename).toLowerCase()

    // Set appropriate content type
    const contentTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
    }

    const contentType = contentTypes[extension] || "application/octet-stream"

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error serving file:", error)
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 })
  }
}
