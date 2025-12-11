import { getArticles } from "@/lib/articles"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
import InfiniteArticleList from "@/components/InfiniteArticleList"
import { getServerTranslations, defaultLanguage } from "@/lib/i18n/server-translations"

const validCategories = ["STEM", "POLITIQUE", "SOCIOLOGIE", "DIVERS", "PHILOSOPHIE"]
const categorySlugMap = {
  philosophie: "philosophy",
  politique: "politics",
  sociologie: "sociology",
  stem: "stem",
  divers: "misc",
}

export async function generateMetadata({ params }) {
  const categorySlug = params.category.toLowerCase()
  const categoryKey = categorySlugMap[categorySlug]
  const baseUrl = "https://www.vhnews.tn"
  if (!categoryKey) {
    return {
      title: "Category Not Found",
    }
  }

  const { t } = await getServerTranslations()
  const categoryName = t(`nav.${categoryKey}`)

  return {
    title: `${categoryName} - VHNews`,
    description: `Latest articles in ${categoryName} category`,
    alternates: {
      canonical: `${baseUrl}/fr/category/${categoryName}`,
      languages: {
        'fr': `${baseUrl}/fr/category/${categoryName}`,
        'en': `${baseUrl}/en/category/${categoryName}`,
        'x-default': `${baseUrl}/category/${categoryName}`,
      },
  }
  
}
}

export default async function CategoryPage({ params }) {
  const { t, locale } = await getServerTranslations()

  const categorySlug = params.category.toLowerCase()
  const categoryKey = categorySlugMap[categorySlug]

  if (!categoryKey) notFound()

  const categoryName = t(`nav.${categoryKey}`)
  const categoryForAPI = categorySlug.toUpperCase() // keep uppercase for DB/API

  // Get initial articles for this category
  const data = await getArticles({
    category: categoryForAPI,
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
            <h1 className="headline text-4xl md:text-5xl mb-4">{categoryName}</h1>
            <p className="text-lg text-muted-foreground">{t("category.subhead")} {categoryName}</p>
          </header>

          {/* Articles */}
          {data.articles.length > 0 ? (
            <InfiniteArticleList
              initialArticles={data.articles}
              initialPage={data.page}
              initialTotalPages={data.totalPages}
              category={categoryForAPI}
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
