import { getArticle } from "@/lib/articles"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    const article = await getArticle(params.slug)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Only return published articles for public API
    if (article.status !== "published") {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}
