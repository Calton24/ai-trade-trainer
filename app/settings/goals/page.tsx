import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Goal Settings",
}

export default function GoalSettingsRedirectPage() {
  redirect("/settings/profile")
}
