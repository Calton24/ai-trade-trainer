import type { Metadata } from "next"

import { DangerZonePanel } from "@/components/settings/danger-zone-panel"
import { SettingsShell } from "@/components/settings/settings-shell"

export const metadata: Metadata = {
  title: "Danger Zone",
}

export default function DangerSettingsPage() {
  return (
    <SettingsShell
      title="Danger Zone"
      description="Irreversible actions. Proceed with care."
    >
      <DangerZonePanel />
    </SettingsShell>
  )
}
