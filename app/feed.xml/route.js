import { getArticles } from "@/lib/articles"
import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = process.env.BASE_URL || "https://your-domain.com"

  try {
    // Get latest 50 published articles
    const { articles } = await getArticles({
      status: "published",
      limit: 50,
    })

    const atomEntries = articles
      .map((article) => {
        const updated = new Date(article.updated_at).toISOString()
        const published = new Date(article.published_at).toISOString()
        const articleUrl = `${baseUrl}/articles/${article.slug}`

        return `
  <entry>
    <title type="html"><![CDATA[${article.title}]]></title>
    <link href="${articleUrl}" rel="alternate" type="text/html"/>
    <id>${articleUrl}</id>
    <published>${published}</published>
    <updated>${updated}</updated>
    <author>
      <name>${article.author}</name>
    </author>
    <summary type="html"><![CDATA[${article.excerpt || article.meta_description || ""}]]></summary>
    <category term="${article.category}"/>
    ${article.tags?.map((tag) => `<category term="${tag}"/>`).join("") || ""}
  </entry>`
      })
      .join("")

    const atomXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>News Site</title>
  <subtitle>Latest news and analysis covering politics, science, sociology, and more</subtitle>
  <link href="${baseUrl}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${baseUrl}" rel="alternate" type="text/html"/>
  <id>${baseUrl}/</id>
  <updated>${new Date().toISOString()}</updated>
  <rights>Copyright © ${new Date().getFullYear()} News Site</rights>
  <generator uri="https://nextjs.org/" version="14.2.5">Next.js</generator>
  ${atomEntries}
</feed>`

    return new NextResponse(atomXml, {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error generating Atom feed:", error)
    return NextResponse.json({ error: "Failed to generate Atom feed" }, { status: 500 })
  }
}
