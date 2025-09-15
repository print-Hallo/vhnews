import { remark } from "remark"
import remarkHtml from "remark-html"
import remarkGfm from "remark-gfm"

const processor = remark().use(remarkGfm).use(remarkHtml, { sanitize: false })

export async function markdownToHtml(markdown) {
  const result = await processor.process(markdown)
  return result.toString()
}

export function extractExcerpt(markdown, maxLength = 200) {
  // Remove markdown formatting and get plain text
  const plainText = markdown
    .replace(/#{1,6}\s+/g, "") // Remove headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/`(.*?)`/g, "$1") // Remove code
    .replace(/!\[.*?\]$$.*?$$/g, "") // Remove images
    .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1") // Remove links, keep text
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim()

  if (plainText.length <= maxLength) return plainText

  // Find the last complete word within the limit
  const truncated = plainText.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")

  return lastSpace > 0 ? truncated.substring(0, lastSpace) + "..." : truncated + "..."
}

export function getProseClasses() {
  return `
    prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground
    prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
    prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6
    prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
    prose-p:mb-4 prose-p:leading-relaxed prose-p:text-foreground
    prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80
    prose-strong:font-semibold prose-strong:text-foreground
    prose-em:italic prose-em:text-foreground
    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6
    prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-1
    prose-img:rounded-lg prose-img:my-6
    prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
    prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
  `
}
