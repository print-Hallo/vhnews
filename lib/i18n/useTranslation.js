"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { translations, defaultLanguage } from "./translations"

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage)

  useEffect(() => {
    // Get language from localStorage or browser preference
    const savedLanguage = localStorage.getItem("vh-news-language")
    const browserLanguage = navigator.language.split("-")[0]

    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    } else if (translations[browserLanguage]) {
      setCurrentLanguage(browserLanguage)
    }
  }, [])

  const changeLanguage = (language) => {
    if (translations[language]) {
      setCurrentLanguage(language)
      localStorage.setItem("vh-news-language", language)
    }
  }

  const t = (key) => {
    const keys = key.split(".")
    let value = translations[currentLanguage]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  return <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider")
  }
  return context
}
