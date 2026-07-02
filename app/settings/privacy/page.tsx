import type { Metadata } from "next"

import { PrivacySettingsPanel } from "@/components/settings/privacy-settings-panel"
import { SettingsShell } from "@/components/settings/settings-shell"

export const metadata: Metadata = {
  title: "Privacy Settings",
}

export default function PrivacySettingsPage() {
  return (
    <SettingsShell
      title="Privacy"
      description="Control what others see on leaderboards and public profiles."
    >
      <PrivacySettingsPanel />
    </SettingsShell>
  )
}
