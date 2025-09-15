import { getArticles } from "@/lib/articles"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    const options = {
      limit: Number.parseInt(searchParams.get("limit")) || 12,
      page: Number.parseInt(searchParams.get("page")) || 1,
      category: searchParams.get("category") || undefined,
      tag: searchParams.get("tag") || undefined,
      q: searchParams.get("q") || undefined,
      status: "published",
      includeScheduled: true,
    }

    const result = await getArticles(options)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
