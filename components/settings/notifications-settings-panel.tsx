"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { useUserSettings } from "@/lib/settings/use-user-settings"
import type { NotificationPreferences } from "@/lib/settings/types"

export function NotificationsSettingsPanel() {
  const { settings, setSettings, save, loading, saving, error } = useUserSettings()
  const n = settings.notifications

  function patch(p: Partial<NotificationPreferences>) {
    setSettings((s) => ({ ...s, notifications: { ...s.notifications, ...p } }))
  }

  if (loading) return <Skeleton className="h-64 w-full rounded-xl" />

  const items: { id: string; label: string; key: keyof NotificationPreferences }[] = [
    { id: "daily", label: "Daily reminder", key: "dailyReminder" },
    { id: "weekly", label: "Weekly target reminder", key: "weeklyTargetReminder" },
    { id: "streak", label: "Streak reminder", key: "streakReminder" },
    { id: "challenge", label: "Challenge reminder", key: "challengeReminder" },
    { id: "content", label: "New lesson & course updates", key: "newContentUpdates" },
    { id: "leaderboard", label: "Leaderboard updates", key: "leaderboardUpdates" },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Email & in-app reminders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <p className="mb-3 text-xs text-muted-foreground">
            Preferences are saved now. Email delivery will be enabled in a future
            update.
          </p>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b border-border/40 py-3 last:border-0"
            >
              <Label htmlFor={item.id}>{item.label}</Label>
              <Switch
                id={item.id}
                checked={n[item.key]}
                onCheckedChange={(v) => patch({ [item.key]: v })}
              />
            </div>
          ))}
        </CardContent>
      </Card>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button disabled={saving} onClick={() => void save(settings)}>
        {saving ? "Saving..." : "Save notification preferences"}
      </Button>
    </div>
  )
}
