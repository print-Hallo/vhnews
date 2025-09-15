"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Palette, Type, Layout, Settings, RotateCcw } from "lucide-react"
import { useTheme } from "@/lib/theme"

export default function ThemeSettings() {
  const { theme, updateTheme, resetTheme } = useTheme()
  const [success, setSuccess] = useState("")

  const handleColorChange = (colorKey, value) => {
    updateTheme({
      colors: {
        ...theme.colors,
        [colorKey]: value,
      },
    })
    setSuccess("Colors updated successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleTypographyChange = (key, value) => {
    updateTheme({
      typography: {
        ...theme.typography,
        [key]: value,
      },
    })
    setSuccess("Typography updated successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleLayoutChange = (key, value) => {
    updateTheme({
      layout: {
        ...theme.layout,
        [key]: value,
      },
    })
    setSuccess("Layout updated successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleBrandingChange = (key, value) => {
    updateTheme({
      branding: {
        ...theme.branding,
        [key]: value,
      },
    })
    setSuccess("Branding updated successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleReset = () => {
    resetTheme()
    setSuccess("Theme reset to defaults!")
    setTimeout(() => setSuccess(""), 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-xl font-bold">Theme Settings</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button asChild>
                <Link href="/" target="_blank">
                  Preview Site
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="colors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Branding
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Primary Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primary"
                        type="color"
                        value={theme.colors.primary}
                        onChange={(e) => handleColorChange("primary", e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={theme.colors.primary}
                        onChange={(e) => handleColorChange("primary", e.target.value)}
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="secondary"
                        type="color"
                        value={theme.colors.secondary}
                        onChange={(e) => handleColorChange("secondary", e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={theme.colors.secondary}
                        onChange={(e) => handleColorChange("secondary", e.target.value)}
                        placeholder="#666666"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accent">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="accent"
                        type="color"
                        value={theme.colors.accent}
                        onChange={(e) => handleColorChange("accent", e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={theme.colors.accent}
                        onChange={(e) => handleColorChange("accent", e.target.value)}
                        placeholder="#0066cc"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Background Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="background">Background</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="background"
                        type="color"
                        value={theme.colors.background}
                        onChange={(e) => handleColorChange("background", e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={theme.colors.background}
                        onChange={(e) => handleColorChange("background", e.target.value)}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surface">Surface</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="surface"
                        type="color"
                        value={theme.colors.surface}
                        onChange={(e) => handleColorChange("surface", e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={theme.colors.surface}
                        onChange={(e) => handleColorChange("surface", e.target.value)}
                        placeholder="#f8f9fa"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="border">Border</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="border"
                        type="color"
                        value={theme.colors.border}
                        onChange={(e) => handleColorChange("border", e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={theme.colors.border}
                        onChange={(e) => handleColorChange("border", e.target.value)}
                        placeholder="#e5e7eb"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Font Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Body Font</Label>
                    <Select
                      value={theme.typography.fontFamily}
                      onValueChange={(value) => handleTypographyChange("fontFamily", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system-ui">System UI</SelectItem>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="sans-serif">Sans Serif</SelectItem>
                        <SelectItem value="monospace">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headingFont">Heading Font</Label>
                    <Select
                      value={theme.typography.headingFont}
                      onValueChange={(value) => handleTypographyChange("headingFont", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="sans-serif">Sans Serif</SelectItem>
                        <SelectItem value="system-ui">System UI</SelectItem>
                        <SelectItem value="monospace">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Text Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Select
                      value={theme.typography.fontSize}
                      onValueChange={(value) => handleTypographyChange("fontSize", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lineHeight">Line Height</Label>
                    <Select
                      value={theme.typography.lineHeight}
                      onValueChange={(value) => handleTypographyChange("lineHeight", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tight">Tight</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="relaxed">Relaxed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout">
            <Card>
              <CardHeader>
                <CardTitle>Layout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxWidth">Max Width</Label>
                    <Select
                      value={theme.layout.maxWidth}
                      onValueChange={(value) => handleLayoutChange("maxWidth", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024px">1024px</SelectItem>
                        <SelectItem value="1200px">1200px</SelectItem>
                        <SelectItem value="1400px">1400px</SelectItem>
                        <SelectItem value="100%">Full Width</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spacing">Spacing</Label>
                    <Select
                      value={theme.layout.spacing}
                      onValueChange={(value) => handleLayoutChange("spacing", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="spacious">Spacious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="borderRadius">Border Radius</Label>
                    <Select
                      value={theme.layout.borderRadius}
                      onValueChange={(value) => handleLayoutChange("borderRadius", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Site Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={theme.branding.siteName}
                    onChange={(e) => handleBrandingChange("siteName", e.target.value)}
                    placeholder="VH News"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={theme.branding.tagline}
                    onChange={(e) => handleBrandingChange("tagline", e.target.value)}
                    placeholder="Latest News and Analysis"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={theme.branding.logo}
                    onChange={(e) => handleBrandingChange("logo", e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
