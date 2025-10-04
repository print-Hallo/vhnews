"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"

interface LanguageSwitcherProps {
  variant?: "select" | "buttons"
}

export default function LanguageSwitcher({ variant = "select" }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [currentLanguage, setCurrentLanguage] = useState("fr")

  useEffect(() => {
    // Extract locale from pathname
    const pathSegments = pathname.split("/")
    const localeFromPath = pathSegments[1]

    if (["fr", "en"].includes(localeFromPath)) {
      setCurrentLanguage(localeFromPath)
    }
  }, [pathname])

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage)

    // Get current path without locale
    const pathSegments = pathname.split("/")
    const currentLocale = pathSegments[1]

    let newPath
    if (["fr", "en"].includes(currentLocale)) {
      // Replace existing locale
      pathSegments[1] = newLanguage
      newPath = pathSegments.join("/")
    } else {
      // Add locale to beginning
      newPath = `/${newLanguage}${pathname}`
    }

    window.location.href = newPath

  }

  if (variant === "buttons") {
    return (
      <div className="flex items-center gap-1">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <Button
          variant={currentLanguage === "fr" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleLanguageChange("fr")}
          className="h-6 px-2 text-xs"
        >
          FR
        </Button>
        <Button
          variant={currentLanguage === "en" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleLanguageChange("en")}
          className="h-6 px-2 text-xs"
        >
          EN
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-20 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fr">FR</SelectItem>
          <SelectItem value="en">EN</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
