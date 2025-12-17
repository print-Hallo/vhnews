import { getArticles } from "@/lib/articles"
import Header from "@/components/Header"
import InfiniteArticleList from "@/components/InfiniteArticleList"

export async function generateMetadata({ params }) {
  const tag = decodeURIComponent(params.tag)
  const baseUrl = "https://www.vhnews.tn"

  return {
    title: `${tag} - VHNews`,
    description: `Articles tagged with ${tag}`,
    alternates: {
      canonical: `${baseUrl}/fr/tag/${tag}`,
      languages: {
        'fr': `${baseUrl}/fr/tag/${tag}`,
        'en': `${baseUrl}/en/tag/${tag}`,
        'x-default': `${baseUrl}/tag/${tag}`,
      },
  }
}
}

export default async function TagPage({ params }) {
  const tag = decodeURIComponent(params.tag)

  // Get initial articles for this tag
  const data = await getArticles({
    tag,
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
            <h1 className="headline text-4xl md:text-5xl mb-4">#{tag}</h1>
            <p className="text-lg text-muted-foreground">Articles tagged with "{tag}"</p>
          </header>

          {/* Articles */}
          {data.articles.length > 0 ? (
            <InfiniteArticleList
              initialArticles={data.articles}
              initialPage={data.page}
              initialTotalPages={data.totalPages}
              tag={tag}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found with this tag.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
