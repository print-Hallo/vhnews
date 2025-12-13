"use client"

import { markdownToHtml } from "@/lib/markdown"
import { generateStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/Header"
import ArticleCard from "@/components/ArticleCard"
import { Calendar, Clock, User, Facebook, Twitter, Linkedin, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/i18n/client-translations"
export default function ArticlePageClient({ article, relatedArticles, locale="fr" }) {
  if (!article || article.status !== "published") {
    notFound()
  }
  const {t} = useTranslation()
  const [titleEn, setTitleEn] = useState("")
  const [titleFr, setTitleFr] = useState("")
  const [dekEn, setDekEn] = useState("")
  const [dekFr, setDekFr] = useState("")
  const [contentHtml, setContentHtml] = useState("")
  const [contentHtmlEn, setContentHtmlEn] = useState("")
  const [contentHtmlFr, setContentHtmlFr] = useState("")
  const [currentLang, setCurrentLang] = useState("")
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    const pathLang = window.location.pathname.split('/')[1]
    setCurrentLang(pathLang === 'en' || pathLang === 'fr' ? pathLang : 'fr')
  }, [])
  console.log(currentLang)
  useEffect(() => {
    const convertMarkdown = async () => {
      if (article.language === "bi") {
        // Handle bilingual title
        if (article.title.includes('%//%')) {
          const titleParts = article.title.split('%//%')
          setTitleEn(titleParts[0])
          setTitleFr(titleParts[1])
        }

        // Handle bilingual dek/subheadline
        if (article.dek && article.dek.includes('%//%')) {
          const dekParts = article.dek.split('%//%')
          setDekEn(dekParts[0])
          setDekFr(dekParts[1])
        }
        // Split content by %//%
        const [enContent, frContent] = article.content_markdown.split('%//%')
        const htmlEn = await markdownToHtml(enContent || "")
        const htmlFr = await markdownToHtml(frContent || "")
        setContentHtmlEn(htmlEn)
        setContentHtmlFr(htmlFr)
      } else {
        const html = await markdownToHtml(article.content_markdown)
        setContentHtml(html)
      }
    }
    convertMarkdown()

    setShareUrl(window.location.href)

    const baseUrl = window.location.origin
    const structuredData = generateStructuredData(article, baseUrl)
    const breadcrumbData = generateBreadcrumbStructuredData(
      [
        { name: t("paths.home"), url: "/" },
        { name: article.category, url: `/category/${article.category}` },
        { name: article.title, url: `/articles/${article.slug}` },
      ],
      baseUrl,
    )

    // Add structured data to page
    const structuredDataScript = document.createElement("script")
    structuredDataScript.type = "application/ld+json"
    structuredDataScript.textContent = JSON.stringify(structuredData)
    document.head.appendChild(structuredDataScript)
    const breadcrumbScript = document.createElement("script")
    breadcrumbScript.type = "application/ld+json"
    breadcrumbScript.textContent = JSON.stringify(breadcrumbData)
    document.head.appendChild(breadcrumbScript)

    // Cleanup function
    return () => {
      document.head.removeChild(structuredDataScript)
      document.head.removeChild(breadcrumbScript)
    }
  }, [article])
  console.log("aaa", locale)
  const publishedDate = new Date(article.published_at).toLocaleDateString(
    locale === "en" ? "en-GB" : "fr-FR", 
    {
      day: "numeric",
      month: "short",
      ...(locale === "en" ? {} : { year: "numeric" })
    }
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto py-8">
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center px-8 space-x-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
              {t("paths.home")}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/category/${article.category}`} className="hover:text-primary transition-colors">
                {article.category}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium truncate">              {article.language === "bi" 
                ? (currentLang === "en" ? titleEn : titleFr) || article.title
                : article.title}
            </li>
          </ol>
        </nav>

        <article className="max-w-4xl px-12 mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            {/* Category */}
            <div className="mb-4">
              <Link
                href={`/category/${article.category}`}
                className="inline-block px-3 py-1 text-sm font-semibold uppercase tracking-wide text-primary border border-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {article.category}
              </Link>
            </div>

            {/* Title and Dek */}
            <h1 className="font-medium prose text-3xl md:text-4xl lg:text-6xl leading-tight  mb-4">
              {article.language === "bi" 
                ? (currentLang === "en" ? titleEn : titleFr) || article.title
                : article.title}
            </h1>
            {article.dek && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                {article.language === "bi"
                  ? (currentLang === "en" ? dekEn : dekFr) || article.dek
                  : article.dek}
              </p>
            )}
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{t("general.by")} {article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={article.published_at}>{publishedDate}</time>
              </div>
              <div className="text-s flex items-center gap-2">
                <Globe className="h-4 w-4"/>
                {t("editor.language")}: {article.language.toUpperCase()}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.read_time} {t("general.minRead")}</span>
              </div>
              <div className="text-s">
                <span>{article.word_count} {t("general.words")}</span>
              </div>

            </div>
            <div className="flex items-center gap-4">
              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t("general.share")}:</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`,
                        "_blank",
                      )
                    }
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                        "_blank",
                      )
                    }
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                        "_blank",
                      )
                    }
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {
              article.language == "bi" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{t("general.arti_languages")}</span>
                  <Button
                    size="sm"
                    variant={currentLang === "en" ? "default" : "outline"}
                    onClick={() => setCurrentLang("en")}
                    aria-label="Switch language to English"
                  >
                    EN
                  </Button>
                  <Button
                    size="sm"
                    variant={currentLang === "fr" ? "default" : "outline"}
                    onClick={() => setCurrentLang("fr")}
                    aria-label="Switch language to French"
                  >
                    FR
                  </Button>
                </div>
              )
            }
            </div>
            </header>
            {/* Article language switch - condition: if language is BI (bilingual) */}

          {/* Cover Image */}
          {article.cover_image && (
            <div className="relative aspect-[16/9] mb-8 overflow-hidden rounded-lg">
              <Image
                src={article.cover_image || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <div
            className="article-content text-justify prose max-w-none"
            dangerouslySetInnerHTML={{     __html: article.language === "bi" 
              ? (currentLang === "en" ? contentHtmlEn : contentHtmlFr)
              : contentHtml  }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag}`}
                    className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="max-w-4xl px-8 md:px-0 mx-auto mt-16">
            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold mb-8">{t("home.related_Articles")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCard key={relatedArticle.slug} article={relatedArticle} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
