import { getArticles } from "@/lib/articles"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
import InfiniteArticleList from "@/components/InfiniteArticleList"
import { getServerTranslations, defaultLanguage } from "@/lib/i18n/server-translations"

const validCategories = ["STEM", "POLITIQUE", "SOCIOLOGIE", "DIVERS"]

export async function generateMetadata({ params }) {
  const category = params.category.toUpperCase()

  if (!validCategories.includes(category)) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category} - VHNews`,
    description: `Latest articles in ${category.toLowerCase()} category`,
  }
}

export default async function CategoryPage({ params }) {
  const { t, locale } = await getServerTranslations()
  const category = params.category.toUpperCase()

  if (!validCategories.includes(category)) {
    notFound()
  }

  // Get initial articles for this category
  const data = await getArticles({
    category,
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
            <h1 className="headline text-4xl md:text-5xl mb-4">{category}</h1>
            <p className="text-lg text-muted-foreground">{t("category.subhead")} {category.toLowerCase()}</p>
          </header>

          {/* Articles */}
          {data.articles.length > 0 ? (
            <InfiniteArticleList
              initialArticles={data.articles}
              initialPage={data.page}
              initialTotalPages={data.totalPages}
              category={category}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("category.error")}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
