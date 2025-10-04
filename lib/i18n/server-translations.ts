import { headers, cookies } from "next/headers"
import { translations, defaultLanguage } from "./translations"
export { defaultLanguage } from "./translations"

export async function getLocale(): Promise<string> {
  try {
    const headersList = await headers()
    const localeFromHeader = headersList.get("x-locale")

    if (localeFromHeader && translations[localeFromHeader as keyof typeof translations]) {
      return localeFromHeader
    }

    const cookieStore = await cookies()
    const localeCookie = cookieStore.get("locale")

    if (localeCookie?.value && translations[localeCookie.value as keyof typeof translations]) {
      return localeCookie.value
    }
  } catch (error) {
    console.error("Error getting locale:", error)
  }

  return defaultLanguage
}

export async function getServerTranslations() {
  const locale = await getLocale()

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[locale as keyof typeof translations]

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k]
      } else {
        return key
      }
    }

    return typeof value === "string" ? value : key
  }

  return { t, locale }
}
