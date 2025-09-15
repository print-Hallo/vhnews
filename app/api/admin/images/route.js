import { validateAdminToken } from "@/lib/auth"
import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")

export async function GET(request) {
  if (!validateAdminToken(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 20

    // Ensure uploads directory exists
    try {
      await fs.access(UPLOADS_DIR)
    } catch {
      return NextResponse.json({ images: [], total: 0, page, totalPages: 0 })
    }

    const files = await fs.readdir(UPLOADS_DIR)
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase()
      return [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)
    })

    // Get file stats and sort by creation time (newest first)
    const imagesWithStats = await Promise.all(
      imageFiles.map(async (filename) => {
        try {
          const filePath = path.join(UPLOADS_DIR, filename)
          const stats = await fs.stat(filePath)
          return {
            filename,
            url: `/uploads/${filename}`,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
          }
        } catch (error) {
          return null
        }
      }),
    )

    const validImages = imagesWithStats.filter(Boolean).sort((a, b) => b.created - a.created)

    // Pagination
    const total = validImages.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedImages = validImages.slice(startIndex, endIndex)

    return NextResponse.json({
      images: paginatedImages,
      total,
      page,
      limit,
      totalPages,
    })
  } catch (error) {
    console.error("Error fetching images:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}

export async function DELETE(request) {
  if (!validateAdminToken(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { filename } = await request.json()

    if (!filename) {
      return NextResponse.json({ error: "No filename provided" }, { status: 400 })
    }

    // Security check: ensure filename doesn't contain path traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 })
    }

    const filePath = path.join(UPLOADS_DIR, filename)

    try {
      await fs.unlink(filePath)
      return NextResponse.json({ success: true })
    } catch (error) {
      if (error.code === "ENOENT") {
        return NextResponse.json({ error: "File not found" }, { status: 404 })
      }
      throw error
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}
