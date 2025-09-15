export function generateStructuredData(article, baseUrl = "https://vhnews.tn") {
  if (!article) return null

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.meta_description || article.excerpt,
    image: article.cover_image ? `${baseUrl}${article.cover_image}` : undefined,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "News Site",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/articles/${article.slug}`,
    },
    articleSection: article.category,
    keywords: article.tags?.join(", "),
    wordCount: article.word_count,
    timeRequired: `PT${article.read_time}M`,
  }

  return structuredData
}

export function generateBreadcrumbStructuredData(breadcrumbs, baseUrl = "https://vhnews.tn") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.url}`,
    })),
  }
}

export function generateWebsiteStructuredData(baseUrl = "https://vhnews.tn") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "News Site",
    description: "Latest news and updates from around the world. | Les derniers nouvelles et mises à jour du monde entier.",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}
