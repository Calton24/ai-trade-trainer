"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { useUserSettings } from "@/lib/settings/use-user-settings"
import type { PrivacySettings } from "@/lib/settings/types"

function PrivacyToggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/40 py-3 last:border-0">
      <div>
        <Label htmlFor={id} className="font-medium">
          {label}
        </Label>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

export function PrivacySettingsPanel() {
  const { settings, setSettings, save, loading, saving, error } = useUserSettings()
  const priv = settings.privacy

  function patch(p: Partial<PrivacySettings>) {
    setSettings((s) => ({ ...s, privacy: { ...s.privacy, ...p } }))
  }

  if (loading) return <Skeleton className="h-64 w-full rounded-xl" />

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Leaderboard visibility</CardTitle>
        </CardHeader>
        <CardContent>
          <PrivacyToggle
            id="leaderboardVisible"
            label="Appear on public leaderboards"
            description="Requires a username in Profile settings. Email is never shown."
            checked={priv.leaderboardVisible}
            onCheckedChange={(v) => patch({ leaderboardVisible: v })}
          />
          <PrivacyToggle
            id="showCountry"
            label="Show country on leaderboard"
            checked={priv.showCountryOnLeaderboard}
            onCheckedChange={(v) => patch({ showCountryOnLeaderboard: v })}
          />
          <PrivacyToggle
            id="showStreak"
            label="Show streak publicly"
            checked={priv.showStreakPublicly}
            onCheckedChange={(v) => patch({ showStreakPublicly: v })}
          />
          <PrivacyToggle
            id="showRank"
            label="Show trader rank publicly"
            checked={priv.showTraderRankPublicly}
            onCheckedChange={(v) => patch({ showTraderRankPublicly: v })}
          />
          <PrivacyToggle
            id="showUsername"
            label="Show username publicly"
            checked={priv.showUsernamePublicly}
            onCheckedChange={(v) => patch({ showUsernamePublicly: v })}
          />
          <PrivacyToggle
            id="friendLb"
            label="Friend leaderboard visibility"
            description="Coming soon — preference stored for when friends launch."
            checked={priv.friendLeaderboardVisible}
            onCheckedChange={(v) => patch({ friendLeaderboardVisible: v })}
          />
        </CardContent>
      </Card>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button disabled={saving} onClick={() => void save(settings)}>
        {saving ? "Saving..." : "Save privacy settings"}
      </Button>
    </div>
  )
}
