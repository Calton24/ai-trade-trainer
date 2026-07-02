import type { Metadata } from "next"

import { AccountSettingsPanel } from "@/components/settings/account-settings-panel"
import { SettingsShell } from "@/components/settings/settings-shell"

export const metadata: Metadata = {
  title: "Account Settings",
}

export default function AccountSettingsPage() {
  return (
    <SettingsShell
      title="Account"
      description="Email, security, and sign-in options."
    >
      <AccountSettingsPanel />
    </SettingsShell>
  )
}
