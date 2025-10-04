import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import ThemeSettings from "./ThemeSettings"
import { validateAdminTokenServer } from "@/lib/auth"
export const metadata = {
  title: "Theme Settings - Admin",
  description: "Customize your site's appearance",
}

export default async function ThemeSettingsPage() {
  const isAuthenticated = await validateAdminTokenServer()
  if (!isAuthenticated) {
    redirect("/admin/login")
  }
  return <ThemeSettings />
}
