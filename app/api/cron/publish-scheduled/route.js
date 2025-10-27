import { getArticles, saveArticle } from "@/lib/articles"

export const GET = async (req) => {
  try {
    const now = new Date()
    
    // Get scheduled articles
    const result = await getArticles({status: "scheduled", isAdmin: true })
    const scheduledArticles = result.articles
    console.log(scheduledArticles)
    if (!scheduledArticles || scheduledArticles.length === 0) {
      return new Response(JSON.stringify({ published: 0 }), { status: 200 })
    }

    // Filter those ready to publish
    const toPublish = scheduledArticles.filter(
      (a) => new Date(a.scheduled_for) <= now
    )

    for (const article of toPublish) {
      article.status = "published"
      article.published_at = now.toISOString()
      await saveArticle(article)
      console.log(`Published article: ${article.slug}`)
    }

    return new Response(
      JSON.stringify({ published: toPublish.length }),
      { status: 200 }
    )
  } catch (err) {
    console.error("Error publishing scheduled articles:", err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
