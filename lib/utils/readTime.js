// lib/utils/readTime.js

export function calculateReadTime(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return { readTime: 1, wordCount: 0 }
  }

  // Remove markdown syntax to get plain text
  const plainText = markdown
    // Remove headers
    .replace(/#{1,6}\s+/g, '')
    // Remove bold and italic
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`(.*?)`/g, '$1')
    // Remove links
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    // Remove other markdown syntax
    .replace(/[*_~`]/g, '')
    // Clean up whitespace
    .replace(/\n+/g, ' ')
    .trim()

  // Count words (split by whitespace and filter out empty strings)
  const words = plainText.split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length

  // Calculate reading time (average reading speed: 200 words per minute)
  const readingSpeed = 200
  const readTime = Math.max(1, Math.ceil(wordCount / readingSpeed))

  return {
    readTime,
    wordCount
  }
}