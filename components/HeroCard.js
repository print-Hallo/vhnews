"use client"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User } from "lucide-react"
import { useTranslation } from "@/lib/i18n/client-translations"
import { useEffect, useState} from "react"
export default function HeroCard({ article, locale="fr" }) {
  if (!article) return null


  const { t } = useTranslation()
  const [titleEn, setTitleEn] = useState("")
  const [titleFr, setTitleFr] = useState("")
  const [excerptEn, setExcerptEn] = useState("")
  const [excerptFr, setExcerptFr] = useState("")
  const [currentLang, setCurrentLang] = useState("")
  const [dekEn, setDekEn] = useState("")
  const [dekFr, setDekFr] = useState("")
  const publishedDate = new Date(article.published_at).toLocaleDateString(
    currentLang === "en" ? "en-GB" : "fr-FR", 
    {
      day: "numeric",
      month: "long",
      ...(locale === "en" ? {} : { year: "numeric" })
    }
  )
  useEffect(() => {
    const pathLang = window.location.pathname.split('/')[1]
    setCurrentLang(pathLang === 'en' || pathLang === 'fr' ? pathLang : 'fr')

    // Handle bilingual title
    if (article.language === "bi" && article.title.includes('%//%')) {
      const titleParts = article.title.split('%//%')
      setTitleEn(titleParts[0])
      setTitleFr(titleParts[1])
    }

    // Handle bilingual excerpt
    if (article.language === "bi" && article.excerpt && article.excerpt.includes('%//%')) {
      const excerptParts = article.excerpt.split('%//%')
      setExcerptEn(excerptParts[0])
      setExcerptFr(excerptParts[1])
    }

    if (article.language === "bi" && article.dek && article.dek.includes('%//%')){
      const dekParts = article.dek.split('%//%')
      setDekEn(dekParts[0])
      setDekFr(dekParts[1])
    }
  }, [article])


  let categories = [
    {name: "SOCIOLOGIE", equivalent: t("nav.sociology") },
    {name: "STEM", equivalent: t("nav.stem") },
    {name: "POLITIQUE", equivalent: t("nav.politics") },
    {name: "DIVERS", equivalent: t("nav.misc") },
    {name: "PHILOSOPHIE", equivalent: t("nav.philosophy")}
  ]
  const categoryTranslation = categories.find(cat => cat.name === article.category)?.equivalent || article.category
  const articleUrl = `/${currentLang || 'fr'}/articles/${article.slug}`

  return (
    
    <article className="group px-8 lg:px-0 " >
      <Link href={articleUrl} className="block mb-6">
        {/* Hero Image */}
        <div className="relative aspect-[16/9] mb-6  overflow-hidden rounded-lg">
        <Image
            src={article.cover_image.replace(
              '/upload/',
              '/upload/f_auto,q_auto,w_700/'
            )}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw,
                  (max-width: 1024px) 50vw,
                  348px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white bg-primary rounded-full">
              {categoryTranslation}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="headline prose text-3xl  md:text-4xl lg:text-5xl leading-tight group-hover:text-primary transition-colors">
            {article.language === "bi" 
              ? (currentLang === "en" ? titleEn : titleFr) || article.title
            : article.title}
          </h1>

          {article.dek && <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{article.language === "bi" ? (currentLang === "en" ? dekEn : dekFr) || article.dek : article.dek}</p>}

          <p className=" text-base md:text-lg xl:text-xl leading-relaxed line-clamp-3 mr-4 text-justify">
            {article.language === "bi"
              ? (currentLang === "en" ? excerptEn : excerptFr) || article.excerpt
              : article.excerpt}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{publishedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{article.read_time} min {t("time.read")}</span>
            </div>
          </div>

          {/* Read more CTA */}
          <div className="pt-2">
            <span className="inline-flex items-center text-primary font-medium group-hover:underline">
              {t("hero.read_full")} →
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
