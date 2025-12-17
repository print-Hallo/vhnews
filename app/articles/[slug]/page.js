import { getArticle, getArticles } from "@/lib/articles"
import { notFound } from "next/navigation"
import ArticlePageClient from "./ArticlePageClient"
import { getLocale  } from "@/lib/i18n/server-translations"
export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug)
  const articleLanguage = article.language || 'fr'
  const baseUrl = "https://www.vhnews.tn"
  const pathLang = await getLocale() || 'fr'
  let titleEn = article.title
  let titleFr = article.title
  let descEn = article.meta_description || article.excerpt
  let descFr = article.meta_description || article.excerpt
  let metaEn = article.meta_description || article.excerpt
  let metaFr = article.meta_description || article.excerpt
  if (article.language === "bi") {
    if (article.title.includes('%//%')) {
      const titleParts = article.title.split('%//%')
      titleEn = titleParts[0]
      titleFr = titleParts[1]
    }
    if (article.meta_description?.includes('%//%')){
      const metaParts = article.meta_description.split('%//%')
      metaEn = metaParts[0]
      metaFr = metaParts[1]
    }
  }
  const metaDesc =  article.language === "bi" 
  ? (pathLang === "en" ? metaEn : metaFr)
  : article.meta_description 
  const displayTitle = article.language === "bi" 
    ? (pathLang === "en" ? titleEn : titleFr)
    : article.title 
  if (!article) {
    return {
      title: "Article Not Found",
    }
  }
  const localeForUrl = article.language === "bi" ? pathLang : articleLanguage
  return {
    title: displayTitle,
    description: metaDesc || article.excerpt,
    openGraph: {
      title: displayTitle,
      description: metaDesc || article.excerpt,
      images: article.cover_image ? [{ url: article.cover_image }] : [],
      type: "article",
      publishedTime: article.published_at,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description: metaDesc || article.excerpt,
      images: article.cover_image ? [article.cover_image] : [],
    },
    alternates: {
      canonical: `${baseUrl}/${localeForUrl}/articles/${params.slug}`,
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
