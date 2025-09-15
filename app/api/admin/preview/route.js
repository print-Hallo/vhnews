import { markdownToHtml } from "@/lib/markdown"
import { validateAdminToken } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request) {
  if (!validateAdminToken(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { markdown } = await request.json()

    if (!markdown) {
      return NextResponse.json({ error: "No markdown provided" }, { status: 400 })
    }

    const html = await markdownToHtml(markdown)
    return NextResponse.json({ html })
  } catch (error) {
    console.error("Error generating preview:", error)
    return NextResponse.json({ error: "Failed to generate preview" }, { status: 500 })
  }
}
