"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  Loader2Icon,
} from "lucide-react"

import { OnboardingLeaderboardFix } from "@/components/onboarding/onboarding-leaderboard-fix"
import { OnboardingLogoutButton } from "@/components/onboarding/onboarding-logout-button"
import { useAuth } from "@/components/providers/auth-provider"
import { CountrySelect } from "@/components/shared/country-select"
import {
  checkUsernameAction,
  fetchOnboardingStateAction,
  finalizeOnboardingAction,
  saveOnboardingStepAction,
} from "@/lib/auth/onboarding-actions"
import { TRADING_EXPERIENCE_OPTIONS } from "@/lib/auth/types"
import {
  clearOnboardingDraft,
  clearStaleOnboardingDrafts,
  loadOnboardingDraft,
  mergeOnboardingSources,
  saveOnboardingDraft,
} from "@/lib/onboarding/draft-storage"
import {
  DEFAULT_ONBOARDING_DATA,
  ONBOARDING_STEP_COUNT,
  PREFERRED_MARKET_OPTIONS,
  STEP_LABELS,
  type OnboardingData,
  type OnboardingStep,
} from "@/lib/onboarding/types"
import {
  normalizeUsername,
  validateStep,
  isLeaderboardUsernameRequiredError,
  needsLeaderboardUsernameFix,
} from "@/lib/onboarding/validation"
import { TRADING_GOAL_OPTIONS, type TradingGoalId } from "@/lib/settings/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  onboardingGlass,
  saveStatusLabel,
} from "@/components/onboarding/onboarding-styles"
import { cn } from "@/lib/utils"

const INTENSITY = [
  { value: "casual", label: "Casual", detail: "2–3 days / week" },
  { value: "consistent", label: "Consistent", detail: "5 days / week" },
  { value: "locked-in", label: "Locked In", detail: "Daily" },
] as const

const PLANS = [
  { value: "casual", label: "Casual", detail: "~12 months" },
  { value: "six-month", label: "6-Month", detail: "~6 months" },
  { value: "locked-in", label: "Locked In", detail: "90–120 days" },
] as const

const PLAN_LABELS: Record<string, string> = {
  casual: "Casual",
  "six-month": "6-Month",
  "locked-in": "Locked In",
}

type LoadPhase = "session" | "profile" | "ready"
type SaveStatus = "idle" | "draft" | "saved" | "saving" | "error"

export function OnboardingWizard() {
  const { user, profile, refresh } = useAuth()
  const router = useRouter()
  const userId = user?.id ?? null

  const [loadPhase, setLoadPhase] = useState<LoadPhase>("session")
  const [step, setStep] = useState<OnboardingStep>(1)
  const [data, setData] = useState<OnboardingData>(DEFAULT_ONBOARDING_DATA)
  const [error, setError] = useState<string | null>(null)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hydratedRef = useRef(false)

  const patchData = useCallback((patch: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...patch }))
    setSaveStatus("draft")
  }, [])

  useEffect(() => {
    if (!userId) return

    let cancelled = false

    async function hydrate() {
      setLoadPhase("profile")
      clearStaleOnboardingDrafts(userId!)

      const { state, error: fetchError } = await fetchOnboardingStateAction()
      if (cancelled) return

      if (fetchError) {
        setError(fetchError)
        setLoadPhase("ready")
        return
      }

      const draft = loadOnboardingDraft(userId!)
      const remoteData: OnboardingData = state
        ? {
            displayName: state.displayName,
            username: state.username,
            country: state.country,
            optInLeaderboard: state.optInLeaderboard,
            experienceLevel: state.experienceLevel,
            tradingGoals: state.tradingGoals,
            preferredMarket: state.preferredMarket,
            studyIntensity: state.studyIntensity,
            learningPlan: state.learningPlan,
            weeklyTargetDays: state.weeklyTargetDays,
          }
        : {
            ...DEFAULT_ONBOARDING_DATA,
            displayName:
              profile?.name ||
              (typeof user?.user_metadata?.name === "string"
                ? user.user_metadata.name
                : "") ||
              user?.email?.split("@")[0]?.replace(/[._+]/g, " ") ||
              "",
          }
      const remoteStep = state?.step ?? 1
      const merged = mergeOnboardingSources(
        remoteData,
        remoteStep,
        state?.updatedAt ?? null,
        draft
      )

      setData(merged.data)
      setStep(merged.step)
      hydratedRef.current = true
      setLoadPhase("ready")
    }

    void hydrate()

    return () => {
      cancelled = true
    }
  }, [userId, user, profile?.name])

  useEffect(() => {
    if (!userId || !hydratedRef.current || loadPhase !== "ready") return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveOnboardingDraft(userId, data, step)
      setSaveStatus((s) => (s === "saving" ? s : "draft"))
    }, 400)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [data, step, userId, loadPhase])

  async function verifyUsername(username: string) {
    const normalized = normalizeUsername(username)
    if (!normalized) {
      setUsernameError(null)
      return true
    }
    const result = await checkUsernameAction(normalized)
    if (result.error) {
      setUsernameError(result.error)
      return false
    }
    if (!result.available) {
      setUsernameError("Username is already taken.")
      return false
    }
    setUsernameError(null)
    return true
  }

  async function persistStep(
    currentStep: OnboardingStep,
    nextStep: OnboardingStep
  ): Promise<boolean> {
    const validationError = validateStep(currentStep, data)
    if (validationError) {
      setError(validationError)
      return false
    }

    if (currentStep === 1 && data.optInLeaderboard) {
      const ok = await verifyUsername(data.username)
      if (!ok) return false
    }

    setSaving(true)
    setSaveStatus("saving")
    setError(null)

    const result = await saveOnboardingStepAction(currentStep, data, nextStep)
    if (result.error) {
      setError(result.error)
      setSaveStatus("error")
      setSaving(false)
      return false
    }

    saveOnboardingDraft(userId!, data, nextStep)
    setSaveStatus("saved")
    setSaving(false)
    await refresh()
    return true
  }

  async function handleContinue() {
    if (step >= ONBOARDING_STEP_COUNT) return
    const next = (step + 1) as OnboardingStep
    const ok = await persistStep(step, next)
    if (ok) setStep(next)
  }

  async function handleBack() {
    if (step <= 1 || saving) return
    setError(null)
    setStep((step - 1) as OnboardingStep)
  }

  async function handleFinish() {
    const validationError = validateStep(4, data)
    if (isLeaderboardUsernameRequiredError(validationError)) {
      setError(null)
      return
    }
    if (validationError) {
      setError(validationError)
      return
    }
    if (data.optInLeaderboard) {
      const ok = await verifyUsername(data.username)
      if (!ok) return
    }

    setSaving(true)
    setSaveStatus("saving")
    setError(null)

    const finalizeResult = await finalizeOnboardingAction(data)
    if (finalizeResult.error) {
      if (isLeaderboardUsernameRequiredError(finalizeResult.error)) {
        setError(null)
      } else {
        setError(finalizeResult.error)
      }
      setSaveStatus("error")
      setSaving(false)
      return
    }

    if (userId) clearOnboardingDraft(userId)
    setSaveStatus("saved")
    await refresh()
    setSaving(false)
    router.replace("/dashboard?welcome=1")
  }

  function toggleGoal(id: TradingGoalId) {
    patchData({
      tradingGoals: data.tradingGoals.includes(id)
        ? data.tradingGoals.filter((g) => g !== id)
        : [...data.tradingGoals, id],
    })
  }

  if (loadPhase !== "ready") {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {loadPhase === "session"
            ? "Checking session…"
            : "Loading your profile…"}
        </p>
      </div>
    )
  }

  const progressPercent = (step / ONBOARDING_STEP_COUNT) * 100
  const statusLabel = saveStatusLabel(saveStatus)

  return (
    <div className={onboardingGlass.wizardCard}>
      <div className={onboardingGlass.progressHeader}>
        <span className="font-medium text-foreground/90">
          Step {step} of {ONBOARDING_STEP_COUNT} — {STEP_LABELS[step]}
        </span>
        {statusLabel && (
          <span
            className={cn(
              onboardingGlass.savePill,
              (saveStatus === "saved" || saveStatus === "saving") &&
                onboardingGlass.savePillActive
            )}
          >
            {statusLabel}
          </span>
        )}
      </div>

      <div className={onboardingGlass.progressTrack} aria-hidden>
        <div
          className={onboardingGlass.progressFill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-6">
        {step === 1 && (
          <div className={onboardingGlass.stepPanel}>
            <div className={onboardingGlass.field}>
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                className={onboardingGlass.input}
                value={data.displayName}
                onChange={(e) => patchData({ displayName: e.target.value })}
                required
              />
            </div>
            <div className={onboardingGlass.field}>
              <Label htmlFor="username">
                Username{" "}
                {data.optInLeaderboard ? (
                  <span className="font-normal text-primary">
                    (required for leaderboard)
                  </span>
                ) : (
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                )}
              </Label>
              <Input
                id="username"
                className={onboardingGlass.input}
                value={data.username}
                required={data.optInLeaderboard}
                onChange={(e) => {
                  patchData({ username: e.target.value })
                  setUsernameError(null)
                }}
                onBlur={() => {
                  if (data.optInLeaderboard || data.username.trim()) {
                    void verifyUsername(data.username)
                  }
                }}
                placeholder={
                  data.optInLeaderboard
                    ? "Choose a public username"
                    : "Skip for now — add later in Settings"
                }
              />
              {usernameError && (
                <p className="text-xs text-destructive">{usernameError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {data.optInLeaderboard
                  ? "Leaderboard usernames are public. Your email is never shown."
                  : "Optional when starting out. Required only if you join public leaderboards."}
              </p>
            </div>
            <div className={onboardingGlass.field}>
              <Label htmlFor="country">Country</Label>
              <CountrySelect
                id="country"
                variant="glass"
                value={data.country}
                onChange={(country) => patchData({ country })}
              />
            </div>
            <label
              className={onboardingGlass.toggleCard(data.optInLeaderboard)}
            >
              <input
                type="checkbox"
                checked={data.optInLeaderboard}
                onChange={(e) =>
                  patchData({ optInLeaderboard: e.target.checked })
                }
                className="mt-1 size-4 shrink-0 accent-primary"
              />
              <div className="space-y-1">
                <span className="text-sm font-medium">
                  Appear on public leaderboards
                </span>
                <p className="text-xs text-muted-foreground">
                  Leaderboard usernames are public. Your email is never shown.
                  You can change this later in Settings → Privacy.
                </p>
              </div>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className={onboardingGlass.stepPanel}>
            <div className={onboardingGlass.field}>
              <Label htmlFor="experienceLevel">Experience level</Label>
              <select
                id="experienceLevel"
                value={data.experienceLevel}
                onChange={(e) =>
                  patchData({
                    experienceLevel: e.target
                      .value as OnboardingData["experienceLevel"],
                  })
                }
                className={onboardingGlass.select}
              >
                {TRADING_EXPERIENCE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Trading goals</legend>
              <div className="flex flex-wrap gap-2">
                {TRADING_GOAL_OPTIONS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGoal(g.id)}
                    className={onboardingGlass.optionChip(
                      data.tradingGoals.includes(g.id)
                    )}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className={onboardingGlass.field}>
              <Label htmlFor="preferredMarket">
                Preferred market (optional)
              </Label>
              <select
                id="preferredMarket"
                value={data.preferredMarket}
                onChange={(e) => patchData({ preferredMarket: e.target.value })}
                className={onboardingGlass.select}
              >
                {PREFERRED_MARKET_OPTIONS.map((o) => (
                  <option key={o.value || "none"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={onboardingGlass.stepPanel}>
            <div className="space-y-2">
              <Label>Study intensity</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {INTENSITY.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => patchData({ studyIntensity: o.value })}
                    className={onboardingGlass.choiceCard(
                      data.studyIntensity === o.value
                    )}
                  >
                    <p className="font-medium">{o.label}</p>
                    <p className="text-xs text-muted-foreground">{o.detail}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Learning plan</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {PLANS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => patchData({ learningPlan: o.value })}
                    className={onboardingGlass.choiceCard(
                      data.learningPlan === o.value
                    )}
                  >
                    <p className="font-medium">{o.label}</p>
                    <p className="text-xs text-muted-foreground">{o.detail}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className={onboardingGlass.field}>
              <Label htmlFor="weeklyTargetDays">Weekly target (days)</Label>
              <select
                id="weeklyTargetDays"
                value={data.weeklyTargetDays}
                onChange={(e) =>
                  patchData({ weeklyTargetDays: Number(e.target.value) })
                }
                className={onboardingGlass.select}
              >
                {[1, 2, 3, 4, 5, 7].map((d) => (
                  <option key={d} value={d}>
                    {d} day{d === 1 ? "" : "s"} per week
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className={onboardingGlass.summaryCard}>
            <h2 className="text-lg font-semibold">
              You&apos;re ready to begin
            </h2>
            <dl className="space-y-2 text-sm">
              <div className={onboardingGlass.summaryRow}>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{data.displayName}</dd>
              </div>
              <div className={onboardingGlass.summaryRow}>
                <dt className="text-muted-foreground">Plan</dt>
                <dd>{PLAN_LABELS[data.learningPlan] ?? data.learningPlan}</dd>
              </div>
              <div className={onboardingGlass.summaryRow}>
                <dt className="text-muted-foreground">Intensity</dt>
                <dd className="capitalize">
                  {data.studyIntensity.replace("-", " ")}
                </dd>
              </div>
              <div className={onboardingGlass.summaryRow}>
                <dt className="text-muted-foreground">Weekly target</dt>
                <dd>
                  {data.weeklyTargetDays} day
                  {data.weeklyTargetDays === 1 ? "" : "s"} / week
                </dd>
              </div>
              {data.country && (
                <div className={onboardingGlass.summaryRow}>
                  <dt className="text-muted-foreground">Country</dt>
                  <dd>{data.country}</dd>
                </div>
              )}
            </dl>
            <OnboardingLeaderboardFix
              data={data}
              onChange={patchData}
              usernameError={usernameError}
              onUsernameError={setUsernameError}
            />
            <div className={onboardingGlass.highlightCard}>
              <p className="text-sm font-medium text-primary">
                Recommended first step
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Start with <strong>Trading Foundations</strong> — your
                structured path from complete beginner to competent trader.
              </p>
              <Button
                className="mt-3"
                variant="outline"
                size="sm"
                render={<Link href="/paths/trading-foundations" />}
              >
                Preview first lesson
              </Button>
            </div>
          </div>
        )}

        {error && !isLeaderboardUsernameRequiredError(error) && (
          <p className={cn("mt-4", onboardingGlass.error)}>{error}</p>
        )}

        <div className={cn("mt-6", onboardingGlass.footer)}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                disabled={step === 1 || saving}
                onClick={() => void handleBack()}
              >
                <ArrowLeftIcon data-icon="inline-start" />
                Back
              </Button>
              {step < 4 ? (
                <Button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleContinue()}
                >
                  {saving ? "Saving…" : "Continue"}
                  {!saving && <ArrowRightIcon data-icon="inline-end" />}
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={saving || needsLeaderboardUsernameFix(data)}
                  onClick={() => void handleFinish()}
                >
                  {saving ? "Saving your plan…" : "Start my journey"}
                  {!saving && <CheckIcon data-icon="inline-end" />}
                </Button>
              )}
            </div>
            <OnboardingLogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
}
