// lib/articles.js - Adaptive version that works with existing table structure

import { createClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/slugify'
import { calculateReadTime } from '@/lib/utils/readTime'

// Helper function to map between different field names
function mapArticleFields(article) {
  if (!article) return null
  
  // Handle different possible field names from your existing table
  return {
    id: article.id,
    title: article.title,
    slug: article.slug || slugify(article.title),
    dek: article.dek || article.subtitle || '',
    content_markdown: article.content_markdown || article.content || '',
    excerpt: article.excerpt || '',
    author: article.author || 'Unknown Author',
    author_id: article.author_id || slugify(article.author || 'unknown'),
    tags: Array.isArray(article.tags) ? article.tags : (article.tags ? article.tags.split(',').map(t => t.trim()) : []),
    category: article.category || 'DIVERS',
    status: article.status || 'draft',
    cover_image: article.cover_image || article.image_url || '',
    meta_description: article.meta_description || '',
    scheduled_for: article.scheduled_for,
    language: article.language || 'fr',
    position: article.position || 'normal',
    read_time: article.read_time || 1,
    word_count: article.word_count || 0,
    published_at: article.published_at,
    created_at: article.created_at,
    updated_at: article.updated_at,
  }
}

// Server-side functions
export async function getArticles(options = {}) {
  console.log('getArticles called with options:', options) 
  const {
    limit = 12,
    page = 1,
    category,
    tag,
    q,
    language,
    status,
    includeScheduled = false,
    showAllLanguages = true,
    isAdmin = false
  } = options
  console.log('Search query (q):', q)
  const supabase = await createClient()
  
  let query = supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })

  if (!showAllLanguages && language) {
    query = query.eq('language', language)
  }

  // Filter by status
  if (status) {
    query = query.eq('status', status)
    console.log(query)
  } else if (!isAdmin && !includeScheduled) {
    // For public API, only show published articles by default
    query = query.eq('status', 'published')
  }

  // Filter by category
  if (category) {
    query = query.eq('category', category)
  }

  // Search functionality
  if (q) {
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%,content_markdown.ilike.%${q}%,excerpt.ilike.%${q}%`)
  }

  // Filter by tag (handle both array and string formats)
  if (tag) {
    query = query.or(`tags.cs.{${tag}},tags.ilike.%${tag}%`)
  }

  // Handle scheduled articles
  if (includeScheduled) {
    const now = new Date().toISOString()
    query = query.or(`status.eq.published,and(status.eq.scheduled,scheduled_for.lte.${now})`)
  }

  // Get total count for pagination
  let countQuery = supabase
  .from('articles')
  .select('*', { count: 'exact', head: true })

  // Apply the same filters
  if (!showAllLanguages && language) {
    countQuery = countQuery.eq('language', language)
  }
  if (status) {
    countQuery = countQuery.eq('status', status)
  } else if (!isAdmin && !includeScheduled) {
    countQuery = countQuery.eq('status', 'published')
  }
  if (category) {
    countQuery = countQuery.eq('category', category)
  }
  if (q) {
    countQuery = countQuery.or(`title.ilike.%${q}%,content.ilike.%${q}%,content_markdown.ilike.%${q}%,excerpt.ilike.%${q}%`)
  }
  if (tag) {
    countQuery = countQuery.or(`tags.cs.{${tag}},tags.ilike.%${tag}%`)
  }
  if (includeScheduled) {
    const now = new Date().toISOString()
    countQuery = countQuery.or(`status.eq.published,and(status.eq.scheduled,scheduled_for.lte.${now})`)
  }

  const { count } = await countQuery

  // Apply pagination
  const offset = (page - 1) * limit
  query = query.range(offset, offset + limit - 1)

  const { data: articles, error } = await query

  if (error) {
    console.error('Error fetching articles:', error)
    return { articles: [], total: 0, page, totalPages: 0 }
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  // Map the articles to our expected format
  const mappedArticles = (articles || []).map(mapArticleFields)

  return {
    articles: mappedArticles,
    total,
    page,
    totalPages,
  }
}

export async function getArticle(slug) {
  const supabase = await createClient()
  
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !article) {
    return null
  }

  return mapArticleFields(article)
}

export async function saveArticle(articleData) {
  console.log('saveArticle called with:', { 
    slug: articleData.slug, 
    status: articleData.status,
    title: articleData.title 
  })
  const supabase = await createClient()
  
  // Calculate read time and word count
  const { readTime, wordCount } = calculateReadTime(articleData.content_markdown || articleData.content || '')
  
  // Prepare the article data
  const now = new Date().toISOString()
  
  // Create a clean data object with only the fields that exist in your table
  const baseData = {
    title: articleData.title,
    slug: articleData.slug || slugify(articleData.title),
    content: articleData.content_markdown || articleData.content || '', // Use content_markdown if it exists, fallback to content
    excerpt: articleData.excerpt || '',
    author: articleData.author,
    category: articleData.category,
    language: articleData.language || 'fr',
    position: articleData.position || 'normal',
    updated_at: now,
  }

  // Add optional fields only if they exist in your table structure
  if (articleData.dek) baseData.dek = articleData.dek
  if (articleData.content_markdown) baseData.content_markdown = articleData.content_markdown
  if (articleData.author_id) baseData.author_id = articleData.author_id
  if (articleData.tags) baseData.tags = Array.isArray(articleData.tags) ? articleData.tags : articleData.tags.split(',').map(t => t.trim())
  if (articleData.status) baseData.status = articleData.status
  if (articleData.cover_image) baseData.cover_image = articleData.cover_image
  if (articleData.meta_description) baseData.meta_description = articleData.meta_description
  if (articleData.scheduled_for) baseData.scheduled_for = articleData.scheduled_for
  if (readTime) baseData.read_time = readTime
  if (wordCount) baseData.word_count = wordCount

  // Set published_at if publishing for the first time
  if (articleData.status === 'published' && !articleData.published_at) {
    baseData.published_at = now
  } else if (articleData.published_at) {
    baseData.published_at = articleData.published_at
  }

  // Check if article exists (for updates)
  const existingArticle = await getArticle(articleData.slug)
  
  if (existingArticle) {
    // Update existing article
    const { data, error } = await supabase
      .from('articles')
      .update(baseData)
      .eq('slug', articleData.slug)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update article: ${error.message}`)
    }
    
    return mapArticleFields(data)
  } else {
    // Create new article
    baseData.created_at = now
    
    const { data, error } = await supabase
      .from('articles')
      .insert([baseData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create article: ${error.message}`)
    }
    
    return mapArticleFields(data)
  }
}

export async function deleteArticle(slug) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('slug', slug)

  if (error) {
    throw new Error(`Failed to delete article: ${error.message}`)
  }

  return true
}

// Get articles by position - flexible parameter handling
export async function getArticlesByPosition(position, optionsOrLanguage = {}) {
  const supabase = await createClient()
  
  // Handle both old and new parameter formats
  let options = {}
  if (typeof optionsOrLanguage === 'string') {
    // Old format: (position, language, limit)
    options = {
      language: optionsOrLanguage,
      limit: arguments[2] || 5
    }
  } else {
    // New format: (position, options)
    options = {
      limit: 5,
      page: 1,
      ...optionsOrLanguage
    }
  }

  const { language, limit, page } = options
  
  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  // Add position filter if the field exists and position is provided
  if (position && position !== 'all') {
    try {
      query = query.eq('position', position)
    } catch (e) {
      // If position field doesn't exist, just ignore this filter
      console.log('Position field not found, ignoring position filter')
    }
  }

  // Add language filter if the field exists
  if (language) {
    try {
      query = query.eq('language', language)
    } catch (e) {
      console.log('Language field not found, ignoring language filter')
    }
  }

  // Apply pagination
  if (page && page > 1) {
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
  } else {
    query = query.limit(limit)
  }

  const { data: articles, error } = await query

  if (error) {
    console.error('Error fetching articles by position:', error)
    return { articles: [], total: 0, page: page || 1, totalPages: 0 }
  }

  const mappedArticles = (articles || []).map(mapArticleFields)
  
  // Return in the format expected by your homepage
  return {
    articles: mappedArticles,
    total: mappedArticles.length,
    page: page || 1,
    totalPages: 1
  }
}

// Get hero articles (for homepage)
export async function getHeroArticles(language = 'fr') {
  const result = await getArticlesByPosition('hero', { language, limit: 3 })
  return result.articles || []
}

// Get sidebar articles
export async function getSidebarArticles(language = 'fr') {
  const result = await getArticlesByPosition('sidebar', { language, limit: 5 })
  return result.articles || []
}

// Get categories
export async function getCategories() {
  return [
    { id: 'STEM', name: 'STEM', color: '#3B82F6' },
    { id: 'POLITIQUE', name: 'POLITIQUE', color: '#EF4444' },
    { id: 'SOCIOLOGIE', name: 'SOCIOLOGIE', color: '#10B981' },
    { id: 'DIVERS', name: 'DIVERS', color: '#8B5CF6' },
    { id: 'PHILOSOPHY', name: 'PHILOSOPHIE', color: '#ffffff'}
  ]
}