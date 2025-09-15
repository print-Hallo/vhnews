// Calculate read time based on word count and images
export function calculateReadTime(contentMarkdown) {
  // Count words (strip markdown tokens)
  const wordCount = contentMarkdown
    .replace(/[#*_`[\]()]/g, "") // Remove markdown tokens
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  // Count images
  const imageCount = (contentMarkdown.match(/!\[.*?\]$$.*?$$/g) || []).length

  // Algorithm: 225 words per minute + 0.2 minutes per image
  const minutes = Math.max(1, Math.round(wordCount / 225 + imageCount * 0.2))

  return { readTime: minutes, wordCount }
}
