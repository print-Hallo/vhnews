import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import ImageManager from "./ImageManager"
import { validateAdminTokenServer } from "@/lib/auth"

export const metadata = {
  title: "Image Manager - Admin",
  description: "Manage uploaded images",
}

export default async function ImageManagerPage() {
  const isAuthenticated = await validateAdminTokenServer()
  
  if (!isAuthenticated) {
    redirect("/admin/login")
  }
  return <ImageManager />
}
