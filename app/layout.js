import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { generateWebsiteStructuredData } from "@/lib/seo"
import { ClientLanguageProvider } from "@/lib/i18n/client-translations"
import { ThemeProvider } from "@/lib/theme"
import "./globals.css"
import { icons } from "lucide-react"
import "katex/dist/katex.min.css"
import { headers } from "next/headers";
export const metadata = {
  title: {
    default: "VH News - Latest News and Analysis | Dernières nouvelles et analyses",
    template: "%s | VH News",
  },

  description:
    "Stay informed with comprehensive coverage of politics, science, sociology, and more from our expert journalists and analysts. | Restez informé avec une couverture complète de la politique, de la science, de la sociologie et plus encore par nos journalistes et analystes experts.",
  keywords: ["news", "politics", "science", "sociology", "analysis", "journalism", "nouvelles", "politique", "science", "sociologie", "analyse", "journalisme"],
  authors: [{ name: "VH News Editorial Team" }],
  creator: "printHallo",
  publisher: "VH News",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.BASE_URL || "https://your-domain.com"),
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/rss.xml", title: "VH News RSS Feed" },
        { url: "/feed.xml", title: "VH News Atom Feed" },
      ],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "VH News",
    title: "VH News - Latest News and Analysis | Dernières nouvelles et analyses",
    description: "Stay informed with comprehensive coverage of politics, science, sociology, and more. | Restez informé avec une couverture complète de la politique, de la science, de la sociologie et plus encore.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VH News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VH News - Latest News and Analysis",
    description: "Stay informed with comprehensive coverage of politics, science, sociology, and more.",
    images: ["/og-image.png"],
    creator: "@vhnews",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
    generator: 'printHallo'
}

export default function RootLayout({ children, params }) {
  const baseUrl = process.env.BASE_URL || "https://your-domain.com"
  const websiteStructuredData = generateWebsiteStructuredData(baseUrl)
  const locale = headers().get("x-locale") || "fr";  console.log(locale)
  const locales = ["fr", "en"]
  const localizedPaths = locales.reduce((acc, loc) => {
    acc[loc] = `/${loc}${typeof window !== "undefined" ? window.location.pathname.split("/").slice(2).join("/") : ""}`
    return acc
  }, {})
  console.log(localizedPaths[locale])
  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet"/>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="alternate" type="application/rss+xml" title="VH News RSS Feed" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="VH News Atom Feed" href="/feed.xml" />
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css"
          as="style"
        />
        <noscript>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css" />
        </noscript>
        {/* canonical */}
        
        <link rel="canonical" href={`${baseUrl}${localizedPaths[locale]}`} />

        {/* hreflang */}
        {locales.map((loc) => (
          <link key={loc} rel="alternate" href={`${baseUrl}${localizedPaths[loc]}`} hrefLang={loc} />
        ))}
        <link rel="alternate" href={baseUrl} hrefLang="x-default" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider>
          <ClientLanguageProvider>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div
                  className="w-10 h-10"
                  style={{
                    background:
                      "no-repeat linear-gradient(hotpink  0 0), no-repeat linear-gradient(hotpink  0 0), no-repeat linear-gradient(hotpink  0 0), no-repeat linear-gradient(hotpink  0 0)",
                    backgroundSize: "21px 21px",
                    animation: "l5 1.5s infinite cubic-bezier(0.3,1,0,1)",
                  }}
                />
              </div>
            }>{children}</Suspense>
          </ClientLanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}