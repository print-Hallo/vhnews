import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { generateWebsiteStructuredData } from "@/lib/seo"
import { LanguageProvider } from "@/lib/i18n/useTranslation"
import { ThemeProvider } from "@/lib/theme"
import "./globals.css"

export const metadata = {
  title: {
    default: "VH News - Latest News and Analysis",
    template: "%s | VH News",
  },
  description:
    "Stay informed with comprehensive coverage of politics, science, sociology, and more from our expert journalists and analysts.",
  keywords: ["news", "politics", "science", "sociology", "analysis", "journalism"],
  authors: [{ name: "VH News Editorial Team" }],
  creator: "VH News",
  publisher: "VH News",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.BASE_URL || "https://your-domain.com"),
  alternates: {
    canonical: "/",
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
    title: "VH News - Latest News and Analysis",
    description: "Stay informed with comprehensive coverage of politics, science, sociology, and more.",
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
    generator: 'v0.app'
}

export default function RootLayout({ children }) {
  const baseUrl = process.env.BASE_URL || "https://your-domain.com"
  const websiteStructuredData = generateWebsiteStructuredData(baseUrl)

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <link rel="alternate" type="application/rss+xml" title="VH News RSS Feed" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="VH News Atom Feed" href="/feed.xml" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider>
          <LanguageProvider>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
