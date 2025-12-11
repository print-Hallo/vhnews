import { getArticle, getArticles } from "@/lib/articles"
import { notFound } from "next/navigation"
import ArticlePageClient from "./ArticlePageClient"

export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug)
  const articleLanguage = article.language || 'fr'
  const baseUrl = "https://www.vhnews.tn"
  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  return {
    title: article.title,
    description: article.meta_description || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.meta_description || article.excerpt,
      images: article.cover_image ? [{ url: article.cover_image }] : [],
      type: "article",
      publishedTime: article.published_at,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.meta_description || article.excerpt,
      images: article.cover_image ? [article.cover_image] : [],
    },
    alternates: {
      canonical: `${baseUrl}/${articleLanguage}/articles/${params.slug}`,
      languages: {
        'fr': `${baseUrl}/fr/articles/${params.slug}`,
        'en': `${baseUrl}/en/articles/${params.slug}`,
        'x-default': `${baseUrl}/${articleLanguage}/articles/${params.slug}`,
      },
  }
}
}
export default async function ArticlePage({ params }) {
  const article = await getArticle(params.slug)

  if (!article || article.status !== "published") {
    notFound()
  }

  const relatedData = await getArticles({
    category: article.category,
    limit: 4,
  })
  const relatedArticles = relatedData.articles.filter((a) => a.slug !== article.slug).slice(0, 3)

  return <ArticlePageClient article={article} relatedArticles={relatedArticles} />
}
