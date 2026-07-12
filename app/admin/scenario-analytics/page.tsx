import type { Metadata } from "next"

import { AdminBlocked } from "@/components/admin/admin-blocked"
import { ScenarioAnalyticsAdmin } from "@/components/admin/scenario-analytics-admin"
import { requireAdmin } from "@/lib/admin/auth"

export const metadata: Metadata = {
  title: "Scenario Analytics | Admin",
  robots: { index: false, follow: false },
}

export default async function ScenarioAnalyticsPage() {
  const gate = await requireAdmin()

  if (!gate.ok) {
    return <AdminBlocked gate={gate} />
  }

  return <ScenarioAnalyticsAdmin adminEmail={gate.email} />
}
