import { NextResponse } from "next/server"

const locales = ["fr", "en"]
const defaultLocale = "fr"

function getLocale(request) {
  // Check if there's a locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) {
    return pathname.split("/")[1]
  }

  // Check for locale in cookie
  const localeCookie = request.cookies.get("locale")?.value
  if (localeCookie && locales.includes(localeCookie)) {
    return localeCookie
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim())
      .find((lang) => locales.includes(lang.split("-")[0]))

    if (preferredLocale) {
      return preferredLocale.split("-")[0]
    }
  }

  return defaultLocale
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next()
  }

  const locale = getLocale(request)
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  // If no locale in pathname, redirect to add it
  if (!pathnameHasLocale) {
    const newUrl = new URL(`/${locale}${pathname}${request.nextUrl.search}`, request.url)
    const response = NextResponse.redirect(newUrl)
    response.cookies.set("locale", locale, { maxAge: 60 * 60 * 24 * 365 }) // 1 year
    return response
  }

  // If locale is in pathname, rewrite to remove it for internal routing
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, "") || "/"
  const rewriteUrl = new URL(`${pathnameWithoutLocale}${request.nextUrl.search}`, request.url)

  const response = NextResponse.rewrite(rewriteUrl)

  // Set locale in headers for server components to access
  response.headers.set("x-locale", locale)
  response.cookies.set("locale", locale, { maxAge: 60 * 60 * 24 * 365 }) // 1 year

  return response
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|favicon.ico).*)",
  ],
}
