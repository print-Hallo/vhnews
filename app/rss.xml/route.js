import { getArticles } from "@/lib/articles"
import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = "https://www.vhnews.tn"

  try {
    // Get latest 50 published articles
    const { articles } = await getArticles({
      status: "published",
      limit: 50,
    })

    const rssItems = articles
      .map((article) => {
        const pubDate = new Date(article.published_at).toUTCString()
        const articleUrl = `${baseUrl}/articles/${article.slug}`

        return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.excerpt || article.meta_description || ""}]]></description>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author><![CDATA[${article.author}]]></author>
      <category><![CDATA[${article.category}]]></category>
      ${article.tags?.map((tag) => `<category><![CDATA[${tag}]]></category>`).join("") || ""}
    </item>`
      })
      .join("")

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>VHNews</title>
    <description>Latest news and analysis covering politics, science, sociology, and more</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <managingEditor> printHallo@gmail.com (VHNews Editor)</managingEditor>
    <webMaster> printHallo@gmail.com (VHNews Webmaster)</webMaster>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`

    return new NextResponse(rssXml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error generating RSS feed:", error)
    return NextResponse.json({ error: "Failed to generate RSS feed" }, { status: 500 })
  }
}
