"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CountrySelect } from "@/components/shared/country-select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { TRADING_EXPERIENCE_OPTIONS } from "@/lib/auth/types"
import { PREFERRED_MARKET_OPTIONS } from "@/lib/onboarding/types"
import { useUserSettings } from "@/lib/settings/use-user-settings"
import {
  TRADING_GOAL_OPTIONS,
  type LearningPlan,
  type StudyIntensity,
  type TradingGoalId,
} from "@/lib/settings/types"
import { cn } from "@/lib/utils"

const INTENSITY_OPTIONS: {
  value: StudyIntensity
  label: string
  detail: string
}[] = [
  { value: "casual", label: "Casual", detail: "2–3 lessons / week" },
  { value: "consistent", label: "Consistent", detail: "5 lessons / week" },
  { value: "locked-in", label: "Locked In", detail: "Daily learning" },
]

const PLAN_OPTIONS: { value: LearningPlan; label: string; detail: string }[] = [
  { value: "casual", label: "Casual", detail: "~12 month completion" },
  { value: "six-month", label: "6-Month", detail: "~6 month completion" },
  { value: "locked-in", label: "Locked In", detail: "90–120 day completion" },
]

const TARGET_OPTIONS = [1, 2, 3, 4, 5, 7]

export function ProfileSettingsPanel() {
  const { settings, setSettings, save, loading, saving, error } =
    useUserSettings()
  const p = settings.profile

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  function toggleGoal(id: TradingGoalId) {
    setSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        tradingGoals: prev.profile.tradingGoals.includes(id)
          ? prev.profile.tradingGoals.filter((g) => g !== id)
          : [...prev.profile.tradingGoals, id],
      },
    }))
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                value={p.displayName}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    profile: { ...s.profile, displayName: e.target.value },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={p.username}
                placeholder="Optional public username"
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    profile: { ...s.profile, username: e.target.value },
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Optional — required only if you enable public leaderboard
                visibility in Privacy settings.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <CountrySelect
                id="country"
                value={p.country}
                onChange={(country) =>
                  setSettings((s) => ({
                    ...s,
                    profile: { ...s.profile, country },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                value={p.avatarUrl ?? ""}
                placeholder="https://..."
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    profile: {
                      ...s.profile,
                      avatarUrl: e.target.value || null,
                    },
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience level</Label>
            <select
              id="experience"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              value={p.tradingExperience ?? ""}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  profile: {
                    ...s.profile,
                    tradingExperience:
                      (e.target.value as typeof p.tradingExperience) || null,
                  },
                }))
              }
            >
              <option value="">Select...</option>
              {TRADING_EXPERIENCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredMarket">Preferred market</Label>
            <select
              id="preferredMarket"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              value={p.preferredMarket}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  profile: {
                    ...s.profile,
                    preferredMarket: e.target.value,
                  },
                }))
              }
            >
              {PREFERRED_MARKET_OPTIONS.map((o) => (
                <option key={o.value || "none"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Trading goals</Label>
            <div className="flex flex-wrap gap-2">
              {TRADING_GOAL_OPTIONS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => toggleGoal(g.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    p.tradingGoals.includes(g.id)
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/60 text-muted-foreground hover:border-primary/20"
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Study plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Study intensity</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              {INTENSITY_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      profile: { ...s.profile, studyIntensity: o.value },
                    }))
                  }
                  className={cn(
                    "rounded-xl border p-3 text-left text-sm",
                    p.studyIntensity === o.value
                      ? "border-primary/40 bg-primary/10"
                      : "border-border/60 hover:border-primary/20"
                  )}
                >
                  <p className="font-medium">{o.label}</p>
                  <p className="text-xs text-muted-foreground">{o.detail}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preferred learning plan</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              {PLAN_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      profile: { ...s.profile, learningPlan: o.value },
                    }))
                  }
                  className={cn(
                    "rounded-xl border p-3 text-left text-sm",
                    p.learningPlan === o.value
                      ? "border-primary/40 bg-primary/10"
                      : "border-border/60 hover:border-primary/20"
                  )}
                >
                  <p className="font-medium">{o.label}</p>
                  <p className="text-xs text-muted-foreground">{o.detail}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Weekly target (days per week)</Label>
            <div className="flex flex-wrap gap-2">
              {TARGET_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      profile: { ...s.profile, weeklyTargetDays: d },
                    }))
                  }
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm",
                    p.weeklyTargetDays === d
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/60 text-muted-foreground"
                  )}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button disabled={saving} onClick={() => void save(settings)}>
        {saving ? "Saving..." : "Save profile"}
      </Button>
    </div>
  )
}
