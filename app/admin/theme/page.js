import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import ThemeSettings from "./ThemeSettings"

async function checkAuth() {
  const cookieStore = cookies()
  const token = cookieStore.get("admin-token")

  if (!token || token.value !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login")
  }
}

export const metadata = {
  title: "Theme Settings - Admin",
  description: "Customize your site's appearance",
}

export default async function ThemeSettingsPage() {
  await checkAuth()
  return <ThemeSettings />
}
