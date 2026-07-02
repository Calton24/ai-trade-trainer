import type { Metadata } from "next"

import { NotificationsSettingsPanel } from "@/components/settings/notifications-settings-panel"
import { SettingsShell } from "@/components/settings/settings-shell"

export const metadata: Metadata = {
  title: "Notification Settings",
}

export default function NotificationsSettingsPage() {
  return (
    <SettingsShell
      title="Notifications"
      description="Choose which reminders and updates you want."
    >
      <NotificationsSettingsPanel />
    </SettingsShell>
  )
}
