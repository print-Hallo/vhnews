"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { usePathname } from "next/navigation"
import { translations, defaultLanguage } from "./translations"

const LanguageContext = createContext({
  currentLanguage: defaultLanguage,
  t: (key) => key,
})

export function ClientLanguageProvider({ children }) {
  const pathname = usePathname()
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage)

  useEffect(() => {
    // Extract locale from pathname
    const pathSegments = pathname.split("/")
    const localeFromPath = pathSegments[1]

    if (translations[localeFromPath]) {
      setCurrentLanguage(localeFromPath)
    }
  }, [pathname])

  const t = (key) => {
    const keys = key.split(".")
    let value = translations[currentLanguage]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  return <LanguageContext.Provider value={{ currentLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useTranslation must be used within a ClientLanguageProvider")
  }
  return context
}
