import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import ArticleEditor from "./ArticleEditor"

async function checkAuth() {
  const cookieStore = cookies()
  const token = cookieStore.get("admin-token")

  if (!token || token.value !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login")
  }
}

export const metadata = {
  title: "New Article - Admin",
  description: "Create a new article",
}

export default async function NewArticlePage() {
  await checkAuth()

  return <ArticleEditor />
}
