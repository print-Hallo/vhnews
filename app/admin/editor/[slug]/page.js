import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getArticle } from "@/lib/articles"
import ArticleEditor from "../ArticleEditor"

async function checkAuth() {
  const cookieStore = cookies()
  const token = cookieStore.get("admin-token")

  if (!token || token.value !== process.env.ADMIN_PASSWORD) {
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
