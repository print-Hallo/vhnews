"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/lib/i18n/useTranslation"
import { useTheme } from "@/lib/theme"
import LanguageSwitcher from "./LanguageSwitcher"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useTranslation()
  const { theme } = useTheme()

  const categories = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.stem"), href: "/category/STEM" },
    { name: t("nav.politics"), href: "/category/POLITIQUE" },
    { name: t("nav.sociology"), href: "/category/SOCIOLOGIE" },
    { name: t("nav.misc"), href: "/category/DIVERS" },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top bar with logo */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold" style={{ fontFamily: "var(--theme-heading-font)" }}>
            {theme.branding?.siteName || "VH News"}
          </Link>

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className={`${isMenuOpen ? "block" : "hidden"} md:block border-t md:border-t-0 pt-4 md:pt-0 pb-4`}>
          <ul className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            {categories.map((category, index) => (
              <li key={category.name} className="flex items-center gap-4 md:gap-8">
                <Link
                  href={category.href}
                  className="text-sm font-medium uppercase tracking-wide hover:text-primary transition-colors focus-visible"
                >
                  {category.name}
                </Link>
                {index === 0 && <span className="hidden md:inline text-muted-foreground">|</span>}
              </li>
            ))}
            <li className="md:ml-auto flex items-center gap-4">
              {/* Desktop search - Made search bar wider and more accessible */}
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder={t("nav.search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 h-8 text-xs pr-8 focus-visible"
                    aria-label={t("nav.search")}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    aria-label="Search"
                  >
                    <Search className="h-3 w-3" />
                  </Button>
                </div>
              </form>

              <LanguageSwitcher variant="buttons" />

              <Link
                href="/admin"
                className="text-xs text-muted-foreground hover:text-primary transition-colors focus-visible"
              >
                {t("nav.admin")}
              </Link>
            </li>
          </ul>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="md:hidden mt-4">
            <div className="relative">
              <Input
                type="search"
                placeholder={t("nav.searchArticles")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 focus-visible"
                aria-label={t("nav.searchArticles")}
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="md:hidden mt-4 flex justify-center">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  )
}
