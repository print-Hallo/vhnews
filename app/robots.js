export default function robots() {
  const baseUrl = process.env.BASE_URL || "https://your-domain.com"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
