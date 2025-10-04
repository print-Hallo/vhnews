import { redirect } from "next/navigation"
import ArticleEditor from "./ArticleEditor"
import { validateAdminTokenServer } from "@/lib/auth"


export const metadata = {
  title: "New Article - Admin",
  description: "Create a new article",
}

export default async function NewArticlePage() {
  const isAuthenticated = await validateAdminTokenServer()
  if (!isAuthenticated) {
    redirect("/admin/login")
  }
  return <ArticleEditor />
}
