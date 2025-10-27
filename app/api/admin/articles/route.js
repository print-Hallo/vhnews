import { saveArticle, getArticles } from "@/lib/articles"
import { validateAdminToken } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request) {
  if (!validateAdminToken(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const articleData = await request.json()

    // Validate required fields
    if (!articleData.title || !articleData.slug || !articleData.author || !articleData.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Handle scheduled articles
    if (articleData.status === "scheduled") {
      if (!articleData.scheduled_for) {
        return NextResponse.json({ error: "scheduled_for date is required for scheduled articles" }, { status: 400 })
      }

      // Optional: Ensure scheduled_for is in the future
      const scheduledDate = new Date(articleData.scheduled_for)
      if (scheduledDate <= new Date()) {
        return NextResponse.json({ error: "scheduled_for must be in the future" }, { status: 400 })
      }

      // Leave status as "scheduled" in DB
      articleData.published_at = null
    } else if (articleData.status === "published") {
      articleData.published_at = new Date().toISOString()
      articleData.scheduled_for = null
    } else {
      // draft
      articleData.published_at = null
      articleData.scheduled_for = null
    }

    const article = await saveArticle(articleData)
    return NextResponse.json(article)
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}


export async function GET(request) {
  if (!validateAdminToken(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)

    const options = {
      limit: Number.parseInt(searchParams.get("limit")) || 20,
      page: Number.parseInt(searchParams.get("page")) || 1,
      category: searchParams.get("category") || undefined,
      tag: searchParams.get("tag") || undefined,
      q: searchParams.get("q") || undefined,
      status: searchParams.get("status") || undefined,
    }

    const result = await getArticles(options)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
