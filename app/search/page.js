import { getArticles } from "@/lib/articles"
import Header from "@/components/Header"
import InfiniteArticleList from "@/components/InfiniteArticleList"

export async function generateMetadata({ searchParams }) {
  const query = searchParams.q || ""

  return {
    title: query ? `Search: ${query} - News Site` : "Search - News Site",
    description: query ? `Search results for "${query}"` : "Search articles",
  }
}

export default async function SearchPage({ searchParams }) {
  const query = searchParams.q || ""

  // Get initial search results
  const data = await getArticles({
    q: query,
    limit: 12,
    page: 1,
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <header className="mb-12">
            <h1 className="headline text-4xl md:text-5xl mb-4">Search Results</h1>
            {query && (
              <p className="text-lg text-muted-foreground">
                {data.total > 0 ? `${data.total} results for "${query}"` : `No results found for "${query}"`}
              </p>
            )}
            {!query && <p className="text-lg text-muted-foreground">Enter a search term to find articles</p>}
          </header>

          {/* Search Results */}
          {query && data.articles.length > 0 ? (
            <InfiniteArticleList
              initialArticles={data.articles}
              initialPage={data.page}
              initialTotalPages={data.totalPages}
              searchQuery={query}
            />
          ) : query ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No articles found matching your search. Try different keywords or browse our categories.
              </p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}
