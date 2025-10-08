import { getArticles, getArticlesByPosition } from "@/lib/articles"
import { getServerTranslations, defaultLanguage } from "@/lib/i18n/server-translations"
import Header from "@/components/Header"
import HeroCard from "@/components/HeroCard"
import InfiniteArticleList from "@/components/InfiniteArticleList"
import ArticleCard from "@/components/ArticleCard"
const { t, locale } = await getServerTranslations()

export const metadata = {
  title: t("general.title"),
  description: t("general.description"),
}

export default async function HomePage({ searchParams }) {
  // Get language from search params or use default
  const language = searchParams?.lang || defaultLanguage
  const { t, locale } = await getServerTranslations()


  const heroData = await getArticlesByPosition("hero", { limit: 2, page: 1 })
  const heroArticle = heroData.articles[0]

  // If no hero article, get the most recent article
  let fallbackHero = null
  if (!heroArticle) {
    const recentData = await getArticles({ limit: 1, page: 1 })
    fallbackHero = recentData.articles[0]
  }

  // Get sidebar articles
  const sidebarData = await getArticlesByPosition("sidebar", { limit: 10, page: 1 })
  const sidebarArticles = sidebarData.articles

  // Get normal articles for main content (excluding hero if it's a fallback)
  const normalData = await getArticlesByPosition("normal", { limit: 12, page: 1 })
  let normalArticles = normalData.articles

  // If using fallback hero, exclude it from normal articles
  if (!heroArticle && fallbackHero) {
    normalArticles = normalArticles.filter((article) => article.slug !== fallbackHero.slug)
  }

  // Split sidebar articles for left and right
  const leftArticles = sidebarArticles.slice(0, 5)
  const rightArticles = sidebarArticles.slice(5, 10)

  // Get articles for infinite scroll
  const infiniteData = await getArticlesByPosition("normal",{ limit: 12, page: 1 })

  const displayHero = heroArticle || fallbackHero

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-0 py-8">
        {/* Desktop Layout: 3-column grid */}
        <div className="hidden lg:grid lg:grid-cols-[20%_56%_20%] h-[calc(100vh-4rem)] lg:gap-8 mb-12">
          {/* Left Sidebar */}
          <aside className=" overflow-y-auto  h-full space-y-6">
            <div className="border-b border-border pb-4 mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("home.featured")}
              </h2>
            </div>
            <div className="space-y-6 ">
            {leftArticles.length > 0 &&
              leftArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))
            }
            </div>
          </aside>

          {/* Main Content */}
          <section className=" overflow-y-auto h-full">
            <div className="border-b border-border pb-4 mb-8">
              <h1 className="text-lg font-semibold uppercase tracking-wide text-center">
                {heroArticle ? t("home.featuredStory") : t("home.latestNews")}
              </h1>
            </div>
            {displayHero && <HeroCard article={displayHero} locale={locale} />}
            <div className="border-b border-border pb-4 mb-6">
              <h2 className="text-lg font-semibold uppercase tracking-wide">{t("home.moreArticles")}</h2>
            </div>
            <InfiniteArticleList
            initialArticles={infiniteData.articles}
            initialPage={infiniteData.page}
            initialTotalPages={infiniteData.totalPages}
          />
          </section>

          {/* Right Sidebar */}
          <aside className="thin-scrollbar overflow-y-auto h-full space-y-6">
            <div className="border-b border-border pb-4 mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("home.moreStories")}
              </h2>
            </div>
            <div className="space-y-6">
              {rightArticles.length > 0
                ? rightArticles.map((article) => <ArticleCard key={article.slug} article={article} />)
                : normalArticles.slice(5, 10).map((article) => <ArticleCard key={article.slug} article={article} />)}
            </div>
          </aside>
        </div>

        {/* Tablet/Mobile Layout: Single column */}
        <div className="lg:hidden space-y-8 mb-12">
          {/* Hero Section */}
          <section>
            <div className="border-b border-border pb-4 mb-8">
              <h1 className="text-lg font-semibold uppercase tracking-wide text-center">
                {heroArticle ? t("home.featuredStory") : t("home.latestNews")}
              </h1>
            </div>
            {displayHero && <HeroCard article={displayHero} />}
            
          </section>

          {/* Other Articles */}
          <section >
            <div className="border-b border-border pb-4 mb-12 mt-12">
              <h2 className="text-lg text-center font-semibold uppercase tracking-wide">{t("home.moreArticles")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...sidebarArticles, ...normalArticles].slice(0, 8).map((article) => (
                <HeroCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        </div>


      </main>

      {/* Footer */}
      <footer className="border-t border-border py-2">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 {t("home.copyright")} <a href="https://github.com/print-Hallo">printHallo</a></p>
        </div>
      </footer>
    </div>
  )
}