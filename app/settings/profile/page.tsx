import type { Metadata } from "next"

import { ProfileSettingsPanel } from "@/components/settings/profile-settings-panel"
import { SettingsShell } from "@/components/settings/settings-shell"

export const metadata: Metadata = {
  title: "Profile Settings",
}

export default function ProfileSettingsPage() {
  return (
    <SettingsShell
      title="Profile"
      description="Your public identity, goals, and study plan."
    >
      <ProfileSettingsPanel />
    </SettingsShell>
  )
}
