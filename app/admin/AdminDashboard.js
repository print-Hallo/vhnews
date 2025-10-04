"use client"

import { useState } from "react"
import { useTranslation } from "@/lib/i18n/client-translations"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Eye, LogOut, Search, Images, Palette } from "lucide-react"

export default function AdminDashboard({ initialData, filters }) {
  const router = useRouter()
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const {t} = useTranslation()
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleDelete = async (slug) => {
    try {
      const response = await fetch(`/api/admin/articles/${slug}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Refresh the data
        window.location.reload()
      } else {
        alert("Failed to delete article")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete article")
    }
  }

  const handlePublish = async (slug, currentStatus) => {
    const newStatus = currentStatus === "published" ? "draft" : "published"

    try {
      const response = await fetch(`/api/admin/articles/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert("Failed to update article status")
      }
    } catch (error) {
      console.error("Publish error:", error)
      alert("Failed to update article status")
    }
  }

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams()
    if (value && value !== "all") params.set(key, value)
    if (filters.status !== "all" && key !== "status") params.set("status", filters.status)
    if (filters.category && key !== "category") params.set("category", filters.category)

    router.push(`/admin?${params.toString()}`)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      published: "default",
      draft: "secondary",
      scheduled: "outline",
    }

    return (
      <Badge variant={variants[status] || "secondary"} className="capitalize">
        {status}
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold font-serif">
                VH News Admin
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Button type="submit" size="sm" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/images">
                  <Images className="h-4 w-4 mr-2" />
                  Images
                </Link>
              </Button>

              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/theme">
                  <Palette className="h-4 w-4 mr-2" />
                  {t("home.theme")}
                </Link>
              </Button>

              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                {t("home.logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("home.total_articles")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("editor.published")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {data.articles.filter((a) => a.status === "published").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("editor.drafts")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {data.articles.filter((a) => a.status === "draft").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("home.scheduled")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {data.articles.filter((a) => a.status === "scheduled").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button asChild>
            <Link href="/admin/editor">
              <Plus className="h-4 w-4 mr-2" />
              {t("editor.newArticle")}
            </Link>
          </Button>

          <div className="flex gap-4">
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("home.all_status")}</SelectItem>
                <SelectItem value="published">{t("editor.published")}</SelectItem>
                <SelectItem value="draft">{t("editor.draft")}</SelectItem>
                <SelectItem value="scheduled">{t("editor.scheduled")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("category.all")}</SelectItem>
                <SelectItem value="STEM">STEM</SelectItem>
                <SelectItem value="POLITIQUE">{t("nav.politics")}</SelectItem>
                <SelectItem value="SOCIOLOGIE">{t("nav.sociology")}</SelectItem>
                <SelectItem value="DIVERS">{t("nav.misc")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Articles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Articles</CardTitle>
          </CardHeader>
          <CardContent>
            {data.articles.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("editor.title")}</TableHead>
                    <TableHead>{t("editor.category")}</TableHead>
                    <TableHead>{t("editor.status")}</TableHead>
                    <TableHead>{t("editor.author")}</TableHead>
                    <TableHead>{t("editor.updated")}</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.articles.map((article) => (
                    <TableRow key={article.slug}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{article.title}</div>
                          <div className="text-sm text-muted-foreground">{article.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{article.category}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(article.status)}</TableCell>
                      <TableCell>{article.author}</TableCell>
                      <TableCell className="text-sm">{formatDate(article.updated_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {article.status === "published" && (
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/articles/${article.slug}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}

                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/editor/${article.slug}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button
                            size="sm"
                            variant={article.status === "published" ? "secondary" : "default"}
                            onClick={() => handlePublish(article.slug, article.status)}
                          >
                            {article.status === "published" ? "Unpublish" : "Publish"}
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t("editor.delete_article")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t("editor.delete_confirmation")}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t("editor.cancel")}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(article.slug)}>{t("editor.delete")}</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t("editor.no_articles")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === data.page ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("page", pageNum.toString())}
              >
                {pageNum}
              </Button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
