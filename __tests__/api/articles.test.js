/**
 * @jest-environment node
 */

import { GET } from "@/app/api/articles/route"
import { getArticles } from "@/lib/articles"
import jest from "jest"

// Mock the articles lib
jest.mock("@/lib/articles", () => ({
  getArticles: jest.fn(),
}))

describe("/api/articles", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("returns articles successfully", async () => {
    const mockArticles = {
      articles: [
        {
          slug: "test-article",
          title: "Test Article",
          excerpt: "Test excerpt",
          status: "published",
        },
      ],
      total: 1,
      page: 1,
      totalPages: 1,
    }

    getArticles.mockResolvedValue(mockArticles)

    const request = new Request("http://localhost:3000/api/articles")
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockArticles)
    expect(getArticles).toHaveBeenCalledWith({
      limit: 12,
      page: 1,
      category: undefined,
      tag: undefined,
      q: undefined,
      status: "published",
      includeScheduled: true,
    })
  })

  test("handles query parameters", async () => {
    getArticles.mockResolvedValue({ articles: [], total: 0, page: 1, totalPages: 0 })

    const request = new Request("http://localhost:3000/api/articles?limit=5&page=2&category=STEM&q=test")
    await GET(request)

    expect(getArticles).toHaveBeenCalledWith({
      limit: 5,
      page: 2,
      category: "STEM",
      tag: undefined,
      q: "test",
      status: "published",
      includeScheduled: true,
    })
  })

  test("handles errors gracefully", async () => {
    getArticles.mockRejectedValue(new Error("Database error"))

    const request = new Request("http://localhost:3000/api/articles")
    const response = await GET(request)

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe("Failed to fetch articles")
  })
})
