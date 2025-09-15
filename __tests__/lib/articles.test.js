import { calculateReadTime } from "@/lib/articles"
import { slugify, sanitizeFilename } from "@/lib/slugify"
import { extractExcerpt } from "@/lib/markdown"

describe("Article utilities", () => {
  describe("calculateReadTime", () => {
    test("calculates read time correctly for text only", () => {
      const content = "word ".repeat(225) // 225 words
      const result = calculateReadTime(content)

      expect(result.readTime).toBe(1)
      expect(result.wordCount).toBe(225)
    })

    test("calculates read time with images", () => {
      const content = "word ".repeat(225) + "![image](/test.jpg)" // 225 words + 1 image
      const result = calculateReadTime(content)

      expect(result.readTime).toBe(1) // 1 min for words + 0.2 min for image = 1.2, rounded to 1
      expect(result.wordCount).toBe(225)
    })

    test("minimum read time is 1 minute", () => {
      const content = "short"
      const result = calculateReadTime(content)

      expect(result.readTime).toBe(1)
      expect(result.wordCount).toBe(1)
    })

    test("handles multiple images", () => {
      const content = "word ".repeat(450) + "![image1](/test1.jpg) ![image2](/test2.jpg)" // 450 words + 2 images
      const result = calculateReadTime(content)

      expect(result.readTime).toBe(2) // 2 min for words + 0.4 min for images = 2.4, rounded to 2
      expect(result.wordCount).toBe(450)
    })
  })

  describe("slugify", () => {
    test("converts text to slug", () => {
      expect(slugify("Hello World")).toBe("hello-world")
      expect(slugify("This is a Test!")).toBe("this-is-a-test")
      expect(slugify("Special @#$% Characters")).toBe("special-characters")
    })

    test("handles edge cases", () => {
      expect(slugify("")).toBe("")
      expect(slugify("   ")).toBe("")
      expect(slugify("---test---")).toBe("test")
    })
  })

  describe("sanitizeFilename", () => {
    test("sanitizes filenames", () => {
      expect(sanitizeFilename("test file.jpg")).toBe("test_file.jpg")
      expect(sanitizeFilename("file@#$.png")).toBe("file___.png")
    })
  })

  describe("extractExcerpt", () => {
    test("extracts plain text from markdown", () => {
      const markdown = "# Title\n\n**Bold text** and *italic text* with `code`."
      const excerpt = extractExcerpt(markdown, 50)

      expect(excerpt).toBe("Bold text and italic text with code.")
    })

    test("truncates long text", () => {
      const longText = "word ".repeat(100)
      const excerpt = extractExcerpt(longText, 50)

      expect(excerpt.length).toBeLessThanOrEqual(53) // 50 + "..."
      expect(excerpt.endsWith("...")).toBe(true)
    })

    test("removes images and links", () => {
      const markdown = "Text with ![image](/test.jpg) and [link](http://example.com)."
      const excerpt = extractExcerpt(markdown)

      expect(excerpt).toBe("Text with  and link.")
    })
  })
})
