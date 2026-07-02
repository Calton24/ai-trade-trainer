import type { Metadata } from "next"

import { BillingSettingsPanel } from "@/components/settings/billing-settings-panel"
import { SettingsShell } from "@/components/settings/settings-shell"

export const metadata: Metadata = {
  title: "Billing",
}

export default function BillingSettingsPage() {
  return (
    <SettingsShell
      title="Billing"
      description="Manage your subscription and plan."
    >
      <BillingSettingsPanel />
    </SettingsShell>
  )
}
