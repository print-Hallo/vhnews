import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User } from "lucide-react"

export default function ArticleCard({ article, variant = "default" }) {
  if (!article) return null

  const publishedDate = new Date(article.published_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  return (
    <article className="group border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card">
      <Link href={`/articles/${article.slug}`} className="block">
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={article.cover_image || "/placeholder.svg?height=200&width=300&query=news"}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2">
            <span className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white bg-primary/90 rounded">
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="headline text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{article.excerpt}</p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{publishedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.read_time} min</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
