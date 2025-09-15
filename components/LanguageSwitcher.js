"use client"

import { useTranslation } from "@/lib/i18n/useTranslation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"

export default function LanguageSwitcher({ variant = "select" }) {
  const { currentLanguage, changeLanguage, t } = useTranslation()

  if (variant === "buttons") {
    return (
      <div className="flex items-center gap-1">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <Button
          variant={currentLanguage === "fr" ? "default" : "ghost"}
          size="sm"
          onClick={() => changeLanguage("fr")}
          className="h-6 px-2 text-xs"
        >
          FR
        </Button>
        <Button
          variant={currentLanguage === "en" ? "default" : "ghost"}
          size="sm"
          onClick={() => changeLanguage("en")}
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
      <Select value={currentLanguage} onValueChange={changeLanguage}>
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
