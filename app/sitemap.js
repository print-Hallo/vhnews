import { getArticles } from "@/lib/articles"

export default async function sitemap() {
  const baseUrl = process.env.BASE_URL || "https://your-domain.com"

  // Get all published articles
  const { articles } = await getArticles({
    status: "published",
    limit: 1000, // Get all articles
  })

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/category/STEM`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/POLITIQUE`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/SOCIOLOGIE`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/DIVERS`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ]

  // Article pages
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  // Get unique tags
  const allTags = [...new Set(articles.flatMap((article) => article.tags || []))]
  const tagPages = allTags.map((tag) => ({
    url: `${baseUrl}/tag/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.4,
  }))

  return [...staticPages, ...articlePages, ...tagPages]
}
