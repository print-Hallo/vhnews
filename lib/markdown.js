import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkRehype from "remark-rehype"
import rehypeKatex from "rehype-katex"
import rehypeStringify from "rehype-stringify"
import rehypeAddClasses from 'rehype-add-classes'
import rehypeTooltips from "./rehype-tooltips.js"
import rehypeHighlight from "rehype-highlight"

export async function markdownToHtml(markdown) {
  const result = await unified()
    .use(remarkParse)       // Parse markdown
    .use(remarkGfm)         // GitHub-flavored markdown
    .use(remarkMath)        // Support $ and $$
    .use(remarkRehype)      // Turn mdast -> hast
    .use(rehypeKatex)       // Render math with KaTeX
    .use(rehypeAddClasses, {
      'table': 'md-table',   // Adds class md-table to all <table> elements
      'link': 'md-link',     // Adds class md-link to all <a> elements
    })
    .use(rehypeTooltips)    // Custom plugin to add tooltips
    .use(rehypeHighlight)
    .use(rehypeStringify)   // Turn hast -> HTML
    .process(markdown)

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
    prose-h1:text-6xl prose-h1:mb-6 prose-h1:mt-8
    prose-h2:text-4xl prose-h2:mb-4 prose-h2:mt-6
    prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-5
    prose-p:mb-4 prose-p:text-sm prose-p:leading-relaxed prose-p:text-foreground
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


