"use client"

import { useState } from "react"

import { checkUsernameAction } from "@/lib/auth/onboarding-actions"
import {
  hasValidLeaderboardUsername,
  normalizeUsername,
} from "@/lib/onboarding/validation"
import type { OnboardingData } from "@/lib/onboarding/types"
import { onboardingGlass } from "@/components/onboarding/onboarding-styles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface OnboardingLeaderboardFixProps {
  data: OnboardingData
  onChange: (patch: Partial<OnboardingData>) => void
  usernameError: string | null
  onUsernameError: (error: string | null) => void
}

export function OnboardingLeaderboardFix({
  data,
  onChange,
  usernameError,
  onUsernameError,
}: OnboardingLeaderboardFixProps) {
  const [checking, setChecking] = useState(false)

  if (!data.optInLeaderboard || hasValidLeaderboardUsername(data)) {
    return null
  }

  async function checkAvailability() {
    const normalized = normalizeUsername(data.username)
    if (!normalized) {
      onUsernameError("Enter a username first.")
      return
    }
    setChecking(true)
    onUsernameError(null)
    const result = await checkUsernameAction(normalized)
    setChecking(false)
    if (result.error) {
      onUsernameError(result.error)
      return
    }
    if (!result.available) {
      onUsernameError("Username is already taken.")
      return
    }
    onUsernameError(null)
  }

  function turnOffLeaderboard() {
    onChange({ optInLeaderboard: false })
    onUsernameError(null)
  }

  return (
    <div
      className={cn(
        onboardingGlass.highlightCard,
        "border-amber-500/30 bg-amber-500/5"
      )}
    >
      <h3 className="text-sm font-semibold text-amber-200">
        Leaderboard username required
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        You chose to appear on public leaderboards. Pick a username, or turn
        leaderboard visibility off for now. Your email is never shown publicly.
      </p>

      <div className={cn(onboardingGlass.field, "mt-4")}>
        <Label htmlFor="confirm-username">Public username</Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="confirm-username"
            className={cn(onboardingGlass.input, "flex-1")}
            value={data.username}
            onChange={(e) => {
              onChange({ username: e.target.value })
              onUsernameError(null)
            }}
            placeholder="e.g. chart_reader_24"
          />
          <Button
            type="button"
            variant="outline"
            disabled={checking}
            onClick={() => void checkAvailability()}
          >
            {checking ? "Checking…" : "Check availability"}
          </Button>
        </div>
        {usernameError && (
          <p className="text-xs text-destructive">{usernameError}</p>
        )}
      </div>

      <label
        className={cn(onboardingGlass.toggleCard(data.optInLeaderboard), "mt-4")}
      >
        <input
          type="checkbox"
          checked={data.optInLeaderboard}
          onChange={(e) => onChange({ optInLeaderboard: e.target.checked })}
          className="mt-1 size-4 shrink-0 accent-primary"
        />
        <span className="text-sm font-medium">Appear on public leaderboards</span>
      </label>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mt-3 text-muted-foreground"
        onClick={turnOffLeaderboard}
      >
        Turn off leaderboard visibility
      </Button>
    </div>
  )
}
