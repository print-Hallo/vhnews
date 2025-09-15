import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import AdminDashboard from "./AdminDashboard"
import { getArticles } from "@/lib/articles"

async function checkAuth() {
  const cookieStore = cookies()
  const token = cookieStore.get("admin-token")

  if (!token || token.value !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login")
  }
}

export const metadata = {
  title: "Admin Dashboard - News Site",
  description: "Content management system",
}

export default async function AdminPage({ searchParams }) {
  await checkAuth()

  const status = searchParams.status || "all"
  const category = searchParams.category || ""
  const page = Number.parseInt(searchParams.page) || 1

  // Get articles based on filters
  const options = {
    limit: 20,
    page,
    status: status === "all" ? undefined : status,
    category: category || undefined,
  }

  // For admin, we want to see all articles regardless of status
  if (status === "all") {
    delete options.status
  }

  const data = await getArticles(options)

  return <AdminDashboard initialData={data} filters={{ status, category, page }} />
}
