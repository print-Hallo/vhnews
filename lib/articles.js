import fs from "fs/promises"
import path from "path"
import { calculateReadTime } from "./utils/readTime.js"

const ARTICLES_DIR = path.join(process.cwd(), "data", "articles")

export { calculateReadTime }

// Ensure articles directory exists
export async function ensureArticlesDir() {
  try {
    await fs.access(ARTICLES_DIR)
  } catch {
    await fs.mkdir(ARTICLES_DIR, { recursive: true })
  }
}

// Read all articles with filtering and sorting
export async function getArticles(options = {}) {
  const {
    limit = 12,
    page = 1,
    tag,
    category,
    q: searchQuery,
    status = "published",
    includeScheduled = false,
    position, // Added position filter
    language, // Added language filter
  } = options

  await ensureArticlesDir()

  try {
    const files = await fs.readdir(ARTICLES_DIR)
    const jsonFiles = files.filter((file) => file.endsWith(".json"))

    const articles = []

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(ARTICLES_DIR, file)
        const content = await fs.readFile(filePath, "utf-8")
        const article = JSON.parse(content)

        // Filter by status
        if (status === "published") {
          if (article.status !== "published") {
            // Check if scheduled article should be published
            if (article.status === "scheduled" && includeScheduled) {
              const scheduledDate = new Date(article.scheduled_for || article.published_at)
              if (scheduledDate > new Date()) continue
            } else {
              continue
            }
          }
        } else if (article.status !== status) {
          continue
        }

        // Filter by category
        if (category && article.category !== category) continue

        // Filter by tag
        if (tag && !article.tags?.includes(tag)) continue

        if (position && article.position !== position) continue

        if (language && article.language !== language) continue

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          const titleMatch = article.title?.toLowerCase().includes(query)
          const excerptMatch = article.excerpt?.toLowerCase().includes(query)
          const contentMatch = article.content_markdown?.toLowerCase().includes(query)
          const tagMatch = article.tags?.some((t) => t.toLowerCase().includes(query))

          if (!titleMatch && !excerptMatch && !contentMatch && !tagMatch) continue
        }

        articles.push(article)
      } catch (error) {
        console.error(`Error reading article ${file}:`, error)
      }
    }

    articles.sort((a, b) => {
      // Position priority: hero > sidebar > normal
      const positionPriority = { hero: 3, sidebar: 2, normal: 1 }
      const aPriority = positionPriority[a.position] || 1
      const bPriority = positionPriority[b.position] || 1

      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }

      // If same position, sort by date
      return new Date(b.published_at) - new Date(a.published_at)
    })

    // Calculate pagination
    const total = articles.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = articles.slice(startIndex, endIndex)

    return {
      articles: paginatedArticles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.error("Error reading articles:", error)
    return { articles: [], total: 0, page: 1, limit, totalPages: 0 }
  }
}

export async function getArticlesByPosition(position, options = {}) {
  return getArticles({ ...options, position })
}

// Get single article by slug
export async function getArticle(slug) {
  await ensureArticlesDir()

  try {
    const filePath = path.join(ARTICLES_DIR, `${slug}.json`)
    const content = await fs.readFile(filePath, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    return null
  }
}

// Save article (create or update)
export async function saveArticle(articleData) {
  await ensureArticlesDir()

  const now = new Date().toISOString()

  // Calculate read time and word count
  const { readTime, wordCount } = calculateReadTime(articleData.content_markdown || "")

  const article = {
    ...articleData,
    read_time: readTime,
    word_count: wordCount,
    updated_at: now,
    created_at: articleData.created_at || now,
    position: articleData.position || "normal",
    language: articleData.language || "fr",
  }

  // Atomic write: write to temp file then rename
  const filePath = path.join(ARTICLES_DIR, `${article.slug}.json`)
  const tempPath = `${filePath}.tmp`

  try {
    await fs.writeFile(tempPath, JSON.stringify(article, null, 2))
    await fs.rename(tempPath, filePath)
    return article
  } catch (error) {
    // Clean up temp file if it exists
    try {
      await fs.unlink(tempPath)
    } catch {}
    throw error
  }
}

// Delete article
export async function deleteArticle(slug) {
  const filePath = path.join(ARTICLES_DIR, `${slug}.json`)
  try {
    await fs.unlink(filePath)
    return true
  } catch (error) {
    return false
  }
}
