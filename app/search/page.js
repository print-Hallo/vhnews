import { getArticles } from "@/lib/articles"
import Header from "@/components/Header"
import InfiniteArticleList from "@/components/InfiniteArticleList"
import { getServerTranslations, defaultLanguage } from "@/lib/i18n/server-translations"

export async function generateMetadata({ searchParams }) {
  const query = searchParams.q || ""
  const {t, locale} = await getServerTranslations()

  return {
    title: query ? `Search: ${query} - News Site` : "Search - News Site",
    description: query ? `${t("search.search_results_for")} "${query}"` : `${t("search.search_articles")}`,
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
  const {t, locale} = await getServerTranslations()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <header className="mb-12">
            <h1 className="headline text-4xl md:text-5xl mb-4">{t("search.result_title")}</h1>
            {query && (
              <p className="text-lg text-muted-foreground">
            {data.total > 0 ? `${data.total} ${t("search.results_for")} "${query}"` : `${t("search.no_results")} "${query}"`}
              </p>
            )}
            {!query && <p className="text-lg text-muted-foreground">{t("search.nothing_written")}</p>}
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
                {t("search.error")}
              </p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}
