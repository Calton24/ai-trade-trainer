import type { Metadata } from "next"

import { AdminBlocked } from "@/components/admin/admin-blocked"
import { ScenarioBuilderContent } from "@/components/admin/scenario-builder-content"
import { requireAdmin } from "@/lib/admin/auth"

export const metadata: Metadata = {
  title: "Scenario Builder | Admin",
  robots: { index: false, follow: false },
}

export default async function ScenarioBuilderPage() {
  const gate = await requireAdmin()

  if (!gate.ok) {
    return <AdminBlocked gate={gate} />
  }

  return <ScenarioBuilderContent adminEmail={gate.email} />
}
