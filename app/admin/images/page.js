import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import ImageManager from "./ImageManager"

async function checkAuth() {
  const cookieStore = cookies()
  const token = cookieStore.get("admin-token")

  if (!token || token.value !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login")
  }
}

export const metadata = {
  title: "Image Manager - Admin",
  description: "Manage uploaded images",
}

export default async function ImageManagerPage() {
  await checkAuth()

  return <ImageManager />
}
