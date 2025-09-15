"use client"

import { useState, useEffect, useCallback } from "react"
import ArticleCard from "./ArticleCard"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function InfiniteArticleList({
  initialArticles = [],
  initialPage = 1,
  initialTotalPages = 1,
  category,
  tag,
  searchQuery,
}) {
  const [articles, setArticles] = useState(initialArticles)
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadMore = useCallback(async () => {
    if (loading || page >= totalPages) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: "12",
      })

      if (category) params.append("category", category)
      if (tag) params.append("tag", tag)
      if (searchQuery) params.append("q", searchQuery)

      const response = await fetch(`/api/articles?${params}`)

      if (!response.ok) {
        throw new Error("Failed to load articles")
      }

      const data = await response.json()

      setArticles((prev) => [...prev, ...data.articles])
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [loading, page, totalPages, category, tag, searchQuery])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    )

    const sentinel = document.getElementById("load-more-sentinel")
    if (sentinel) observer.observe(sentinel)

    return () => observer.disconnect()
  }, [loadMore, loading, page, totalPages])

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No articles found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        {articles.map((article, index) => (
          <ArticleCard key={`${article.slug}-${index}`} article={article} />
        ))}
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-destructive mb-4">Error loading articles: {error}</p>
          <Button onClick={loadMore} variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {/* Load More Button (fallback) */}
      {!loading && page < totalPages && (
        <div className="text-center py-8">
          <Button onClick={loadMore} variant="outline">
            Load More Articles
          </Button>
        </div>
      )}

      {/* Intersection Observer Sentinel */}
      <div id="load-more-sentinel" className="h-1" />
    </div>
  )
}
