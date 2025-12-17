import { getArticles } from "@/lib/articles"

export default async function sitemap() {
  const baseUrl = process.env.BASE_URL || "https://your-domain.com"
  const baseUrlEn = "https://www.vhnews.tn/en"
  const baseUrlFr = "https://www.vhnews.tn/fr"

  // Get all published articles
  const { articles } = await getArticles({
    status: "published",
    limit: 1000, // Get all articles
  })

  // Static pages
  const staticPages = [
    {
      url: baseUrlFr,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: baseUrlEn,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrlFr}/category/STEM`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrlEn}/category/STEM`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrlFr}/category/PHILOSOPHIE`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrlEn}/category/PHILOSOPHIE`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrlFr}/category/POLITIQUE`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrlEn}/category/POLITIQUE`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrlFr}/category/SOCIOLOGIE`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrlEn}/category/SOCIOLOGIE`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrlFr}/category/DIVERS`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrlEn}/category/DIVERS`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ]

  // Article pages
  const articlePages = articles.flatMap((article) => {
    const commonData = {
      lastModified: new Date(article.updated_at),
      changeFrequency: "daily",
      priority: 1,
    };
  
    return [
      {
        url: `${baseUrlFr}/articles/${article.slug}`,
        ...commonData,
      },
      {
        url: `${baseUrlEn}/articles/${article.slug}`,
        ...commonData,
      },
    ];
  });

  // Get unique tags
  const allTags = [...new Set(articles.flatMap((article) => article.tags || []))]
  const tagPages = allTags.flatMap((tag) => {
    const commonData = {
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.4,
    };
  
    return [
      {
        url: `${baseUrlFr}/tag/${encodeURIComponent(tag)}`,
        ...commonData,
      },
      {
        url: `${baseUrlEn}/tag/${encodeURIComponent(tag)}`,
        ...commonData,
      },
    ];
  });
  

  return [...staticPages, ...articlePages, ...tagPages]
}
