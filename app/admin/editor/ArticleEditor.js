"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { slugify } from "@/lib/slugify"
import { calculateReadTime } from "@/lib/utils/readTime"
import { useTranslation } from "@/lib/i18n/client-translations"

export default function ArticleEditor({ article = null }) {
  const router = useRouter()
  const isEditing = !!article
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    title: article?.title || "",
    slug: article?.slug || "",
    dek: article?.dek || "",
    content_markdown: article?.content_markdown || "",
    excerpt: article?.excerpt || "",
    author: article?.author || "",
    author_id: article?.author_id || "",
    tags: article?.tags?.join(", ") || "",
    category: article?.category || "",
    status: article?.status || "draft",
    cover_image: article?.cover_image || "",
    meta_description: article?.meta_description || "",
    scheduled_for: article?.scheduled_for ? new Date(article.scheduled_for).toISOString().slice(0, 16) : "",
    language: article?.language || "fr",
    position: article?.position || "normal",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [previewHtml, setPreviewHtml] = useState("")
  const [readTimeData, setReadTimeData] = useState({ readTime: 1, wordCount: 0 })
  const [imageUploading, setImageUploading] = useState(false)

  useEffect(() => {
    if (formData.title && !isEditing) {
      setFormData((prev) => ({
        ...prev,
        slug: slugify(formData.title),
      }))
    }
  }, [formData.title, isEditing])

  useEffect(() => {
    if (formData.content_markdown) {
      const data = calculateReadTime(formData.content_markdown)
      setReadTimeData(data)
    }
  }, [formData.content_markdown])

  useEffect(() => {
    if (formData.content_markdown && !formData.excerpt) {
      const plainText = formData.content_markdown
        .replace(/#{1,6}\s+/g, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`(.*?)`/g, "$1")
        .replace(/!\[.*?\]$$.*?$$/g, "")
        .replace(/\[([^\]]+)\]$$.*?$$/g, "$1")
        .replace(/\n+/g, " ")
        .trim()

      if (plainText.length > 200) {
        const truncated = plainText.substring(0, 200)
        const lastSpace = truncated.lastIndexOf(" ")
        setFormData((prev) => ({
          ...prev,
          excerpt: lastSpace > 0 ? truncated.substring(0, lastSpace) + "..." : truncated + "...",
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          excerpt: plainText,
        }))
      }
    }
  }, [formData.content_markdown])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = async (file) => {
    setImageUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append("file", file)

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        return data.url // Cloudinary returns secure_url as url
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      setError(`Failed to upload image: ${error.message}`)
      return null
    } finally {
      setImageUploading(false)
    }
  }

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = await handleImageUpload(file)
      if (url) {
        handleInputChange("cover_image", url)
      }
    }
  }

  const handleSave = async (publishStatus = formData.status) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const articleData = {
        ...formData,
        tags: tagsArray,
        status: publishStatus,
        author_id: slugify(formData.author),
        published_at: publishStatus === "published" ? new Date().toISOString() : formData.published_at,
        scheduled_for: publishStatus === "scheduled" ? formData.scheduled_for : null,
      }

      const url = isEditing ? `/api/admin/articles/${article.slug}` : "/api/admin/articles"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(isEditing ? "Article updated successfully!" : "Article created successfully!")
        if (!isEditing) {
          router.push(`/admin/editor/${data.slug}`)
        }
      } else {
        setError(data.message || "Failed to save article")
      }
    } catch (error) {
      setError("Failed to save article")
    } finally {
      setLoading(false)
    }
  }

  const generatePreview = async () => {
    try {
      const response = await fetch("/api/admin/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markdown: formData.content_markdown }),
      })

      if (response.ok) {
        const data = await response.json()
        setPreviewHtml(data.html)
      }
    } catch (error) {
      console.error("Preview generation failed:", error)
    }
  }

  useEffect(() => {
    if (formData.content_markdown) {
      generatePreview()
    }
  }, [formData.content_markdown])

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
                  {t("editor.backToDashboard")}
                </Link>
              </Button>
              <h1 className="text-xl font-bold">{isEditing ? t("editor.editArticle") : t("editor.newArticle")}</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {readTimeData.wordCount} {t("general.words")} • {readTimeData.readTime} {t("general.minRead")}
              </div>

              <Button variant="outline" onClick={() => handleSave("draft")} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                {t("editor.saveDraft")}
              </Button>

              <Button onClick={() => handleSave(formData.status)} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("editor.publish")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t("editor.articleDetails")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("editor.title")}</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder={t("editor.title")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">{t("editor.slug")}</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="article-slug"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dek">{t("editor.subheadline")}</Label>
                  <Input
                    id="dek"
                    value={formData.dek}
                    onChange={(e) => handleInputChange("dek", e.target.value)}
                    placeholder={t("editor.subheadline")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">{t("editor.excerpt")}</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    placeholder={t("editor.excerpt")}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>{t("editor.content")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="editor" className="w-full">
                  <TabsList>
                    <TabsTrigger value="editor">{t("editor.editor")}</TabsTrigger>
                    <TabsTrigger value="preview">{t("editor.preview")}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="editor" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="content">{t("editor.markdownContent")}</Label>
                      <Textarea
                        id="content"
                        value={formData.content_markdown}
                        onChange={(e) => handleInputChange("content_markdown", e.target.value)}
                        placeholder={t("editor.markdownContent")}
                        rows={20}
                        className="font-mono"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="preview">
                    <div
                      className="prose prose-lg max-w-none min-h-[500px] p-4 border rounded-md"
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle>{t("editor.publishing")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">{t("editor.status")}</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">{t("editor.draft")}</SelectItem>
                      <SelectItem value="published">{t("editor.published")}</SelectItem>
                      <SelectItem value="scheduled">{t("editor.scheduled")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.status === "scheduled" && (
                  <div className="space-y-2">
                    <Label htmlFor="scheduled_for">{t("editor.publishDate")}</Label>
                    <Input
                      id="scheduled_for"
                      type="datetime-local"
                      value={formData.scheduled_for}
                      onChange={(e) => handleInputChange("scheduled_for", e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="category">{t("editor.category")}</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("editor.category")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STEM">STEM</SelectItem>
                      <SelectItem value="POLITIQUE">POLITIQUE</SelectItem>
                      <SelectItem value="SOCIOLOGIE">SOCIOLOGIE</SelectItem>
                      <SelectItem value="DIVERS">DIVERS</SelectItem>
                      <SelectItem value="PHILOSOPHIE">PHILOSOPHIE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">{t("editor.language")}</Label>
                  <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">{t("editor.french")}</SelectItem>
                      <SelectItem value="en">{t("editor.english")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">{t("editor.position")}</Label>
                  <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">{t("editor.hero")}</SelectItem>
                      <SelectItem value="sidebar">{t("editor.sidebar")}</SelectItem>
                      <SelectItem value="normal">{t("editor.normal")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Author & Meta */}
            <Card>
              <CardHeader>
                <CardTitle>{t("editor.authorMeta")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="author">{t("editor.author")}</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                    placeholder={t("editor.author")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">{t("editor.tags")}</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="tag1, tag2, tag3"
                  />
                  <div className="text-xs text-muted-foreground">Separate tags with commas</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">{t("editor.metaDescription")}</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => handleInputChange("meta_description", e.target.value)}
                    placeholder={t("editor.metaDescription")}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>{t("editor.coverImage")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cover_image">{t("editor.imageUrl")}</Label>
                  <Input
                    id="cover_image"
                    value={formData.cover_image}
                    onChange={(e) => handleInputChange("cover_image", e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover_upload">{t("editor.uploadImage")}</Label>
                  <Input
                    id="cover_upload"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    disabled={imageUploading}
                  />
                  {imageUploading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("general.uploading")}
                    </div>
                  )}
                </div>

                {formData.cover_image && (
                  <div className="relative">
                    <img
                      src={formData.cover_image || "/placeholder.svg"}
                      alt="Cover preview"
                      className="w-full h-32 object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?key=p8zdw"
                      }}
                    />
                    <div className="mt-2 text-xs text-muted-foreground">{t("general.optimizedCdn")}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
