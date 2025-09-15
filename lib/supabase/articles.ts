import { createClient } from "./server"
import { createClient as createBrowserClient } from "./client"

export interface Article {
  id: string
  title: string
  content: string
  excerpt?: string
  author: string
  category: string
  language: string
  image_url?: string
  image_alt?: string
  position: "hero" | "sidebar" | "normal"
  published_at: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  color: string
  created_at: string
}

// Server-side functions
export async function getArticles(language?: string, category?: string) {
  const supabase = await createClient()

  let query = supabase.from("articles").select("*").order("published_at", { ascending: false })

  if (language) {
    query = query.eq("language", language)
  }

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching articles:", error)
    return []
  }

  return data as Article[]
}

export async function getArticleById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("articles").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching article:", error)
    return null
  }

  return data as Article
}

export async function getHeroArticles(language?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("articles")
    .select("*")
    .eq("position", "hero")
    .order("published_at", { ascending: false })
    .limit(3)

  if (language) {
    query = query.eq("language", language)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching hero articles:", error)
    return []
  }

  return data as Article[]
}

export async function getSidebarArticles(language?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("articles")
    .select("*")
    .eq("position", "sidebar")
    .order("published_at", { ascending: false })
    .limit(5)

  if (language) {
    query = query.eq("language", language)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching sidebar articles:", error)
    return []
  }

  return data as Article[]
}

export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data as Category[]
}

// Client-side functions for admin operations
export async function createArticle(article: Omit<Article, "id" | "created_at" | "updated_at">) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.from("articles").insert([article]).select().single()

  if (error) {
    throw new Error(`Error creating article: ${error.message}`)
  }

  return data as Article
}

export async function updateArticle(id: string, updates: Partial<Article>) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from("articles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(`Error updating article: ${error.message}`)
  }

  return data as Article
}

export async function deleteArticle(id: string) {
  const supabase = createBrowserClient()

  const { error } = await supabase.from("articles").delete().eq("id", id)

  if (error) {
    throw new Error(`Error deleting article: ${error.message}`)
  }
}
