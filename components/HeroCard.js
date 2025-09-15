import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User } from "lucide-react"

export default function HeroCard({ article }) {
  if (!article) return null

  const publishedDate = new Date(article.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <article className="group">
      <Link href={`/articles/${article.slug}`} className="block">
        {/* Hero Image */}
        <div className="relative aspect-[16/9] mb-6 overflow-hidden rounded-lg">
          <Image
            src={article.cover_image || "/placeholder.svg?height=400&width=700&query=news"}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white bg-primary rounded-full">
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="headline text-3xl md:text-4xl lg:text-5xl leading-tight group-hover:text-primary transition-colors">
            {article.title}
          </h1>

          {article.dek && <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{article.dek}</p>}

          <p className="text-base leading-relaxed line-clamp-3">{article.excerpt}</p>

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
              <span>{article.read_time} min read</span>
            </div>
          </div>

          {/* Read more CTA */}
          <div className="pt-2">
            <span className="inline-flex items-center text-primary font-medium group-hover:underline">
              Read full article →
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
