import type { Metadata } from "next"

import { LegalSettingsPanel } from "@/components/settings/legal-settings-panel"
import { SettingsShell } from "@/components/settings/settings-shell"

export const metadata: Metadata = {
  title: "Legal",
}

export default function LegalSettingsPage() {
  return (
    <SettingsShell
      title="Legal"
      description="Terms, privacy, and educational disclaimers."
    >
      <LegalSettingsPanel />
    </SettingsShell>
  )
}
