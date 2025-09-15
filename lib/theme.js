"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export const defaultTheme = {
  colors: {
    primary: "#000000",
    secondary: "#666666",
    accent: "#0066cc",
    background: "#ffffff",
    surface: "#f8f9fa",
    text: "#000000",
    textMuted: "#666666",
    border: "#e5e7eb",
  },
  typography: {
    fontFamily: "system-ui",
    headingFont: "serif",
    fontSize: "medium",
    lineHeight: "normal",
  },
  layout: {
    maxWidth: "1200px",
    spacing: "normal",
    borderRadius: "medium",
  },
  branding: {
    siteName: "VH News",
    tagline: "Latest News and Analysis",
    logo: "",
  },
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(defaultTheme)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("vh-news-theme")
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme)
        setTheme({ ...defaultTheme, ...parsedTheme })
      } catch (error) {
        console.error("Error parsing saved theme:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const updateTheme = (updates) => {
    const newTheme = { ...theme, ...updates }
    setTheme(newTheme)
    localStorage.setItem("vh-news-theme", JSON.stringify(newTheme))
    applyThemeToDOM(newTheme)
  }

  const resetTheme = () => {
    setTheme(defaultTheme)
    localStorage.removeItem("vh-news-theme")
    applyThemeToDOM(defaultTheme)
  }

  // Apply theme to DOM
  const applyThemeToDOM = (themeData) => {
    const root = document.documentElement

    // Apply CSS custom properties
    root.style.setProperty("--theme-primary", themeData.colors.primary)
    root.style.setProperty("--theme-secondary", themeData.colors.secondary)
    root.style.setProperty("--theme-accent", themeData.colors.accent)
    root.style.setProperty("--theme-background", themeData.colors.background)
    root.style.setProperty("--theme-surface", themeData.colors.surface)
    root.style.setProperty("--theme-text", themeData.colors.text)
    root.style.setProperty("--theme-text-muted", themeData.colors.textMuted)
    root.style.setProperty("--theme-border", themeData.colors.border)

    root.style.setProperty("--theme-font-family", themeData.typography.fontFamily)
    root.style.setProperty("--theme-heading-font", themeData.typography.headingFont)
    root.style.setProperty("--theme-font-size", getFontSizeValue(themeData.typography.fontSize))
    root.style.setProperty("--theme-line-height", getLineHeightValue(themeData.typography.lineHeight))

    root.style.setProperty("--theme-max-width", themeData.layout.maxWidth)
    root.style.setProperty("--theme-spacing", getSpacingValue(themeData.layout.spacing))
    root.style.setProperty("--theme-border-radius", getBorderRadiusValue(themeData.layout.borderRadius))
  }

  useEffect(() => {
    if (!isLoading) {
      applyThemeToDOM(theme)
    }
  }, [theme, isLoading])

  return <ThemeContext.Provider value={{ theme, updateTheme, resetTheme, isLoading }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

// Helper functions
function getFontSizeValue(size) {
  const sizes = {
    small: "14px",
    medium: "16px",
    large: "18px",
  }
  return sizes[size] || sizes.medium
}

function getLineHeightValue(height) {
  const heights = {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  }
  return heights[height] || heights.normal
}

function getSpacingValue(spacing) {
  const spacings = {
    compact: "0.75",
    normal: "1",
    spacious: "1.5",
  }
  return spacings[spacing] || spacings.normal
}

function getBorderRadiusValue(radius) {
  const radii = {
    none: "0px",
    small: "4px",
    medium: "8px",
    large: "12px",
  }
  return radii[radius] || radii.medium
}
