import { redirect } from "next/navigation"
import { getArticle } from "@/lib/articles"
import ArticleEditor from "../ArticleEditor"
import { validateAdminTokenServer } from "@/lib/auth"
async function checkAuth() {
  const isAuthenticated = await validateAdminTokenServer()
  if (!isAuthenticated) {
    redirect("/admin/login")
  }
}

export const metadata = {
  title: "Edit Article - Admin",
  description: "Edit article",
}

export default async function EditArticlePage({ params }) {
  await checkAuth()

  const article = await getArticle(params.slug)

  if (!article) {
    redirect("/admin")
  }

  return <ArticleEditor article={article} />
}
