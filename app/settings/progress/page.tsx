import type { Metadata } from "next"

import { ProgressSettingsPanel } from "@/components/settings/progress-settings-panel"
import { SettingsShell } from "@/components/settings/settings-shell"

export const metadata: Metadata = {
  title: "Progress & Data",
}

export default function ProgressSettingsPage() {
  return (
    <SettingsShell
      title="Progress & Data"
      description="Export, review, or reset your learning data."
    >
      <ProgressSettingsPanel />
    </SettingsShell>
  )
}
