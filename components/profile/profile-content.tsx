"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowRightIcon,
  BookMarkedIcon,
  CandlestickChartIcon,
  ClipboardListIcon,
  GraduationCapIcon,
  LayersIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { useAuth } from "@/components/providers/auth-provider"
import { useUserState } from "@/components/providers/user-state-provider"
import { StatCard } from "@/components/shared/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { enrollInFeature } from "@/lib/auth/actions"
import { ENROLLABLE_FEATURES } from "@/lib/auth/types"
import { getLevelTitle, xpProgressPercent } from "@/lib/progression/levels"
import { calculateDailyStreak } from "@/lib/user-state"
import { PHASE_LABELS } from "@/lib/competence/types"
import { cn } from "@/lib/utils"

function SkillRadar({
  scores,
}: {
  scores: Record<string, number>
}) {
  const items = [
    { label: "Market Knowledge", score: scores["market-knowledge"] ?? 0 },
    { label: "Chart Reading", score: scores["chart-reading"] ?? 0 },
    {
      label: "Trend Recognition",
      score: scores["chart-reading"] ?? scores["trade-selection"] ?? 0,
    },
    { label: "Risk Management", score: scores["risk-management"] ?? 0 },
    { label: "Psychology", score: scores.psychology ?? 0 },
    { label: "Strategy Execution", score: scores["strategy-mastery"] ?? 0 },
  ]

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{item.label}</span>
            <span className="font-medium">{item.score}%</span>
          </div>
          <Progress value={item.score} className="h-1.5" />
        </div>
      ))}
    </div>
  )
}

const featureIcons: Record<string, typeof GraduationCapIcon> = {
  "trading-foundations": GraduationCapIcon,
  "price-action": GraduationCapIcon,
  "book-lab": BookMarkedIcon,
  "chart-lab": CandlestickChartIcon,
  "trend-spotter": TrendingUpIcon,
  "strategy-wiki": ClipboardListIcon,
}

export function ProfileContent() {
  const { user, profile, enrollments, isConfigured } = useAuth()
  const {
    state,
    traderReadinessStats,
    competenceScores,
    flashcardStats,
    trendSpotterStats,
    strategyWikiStats,
  } = useUserState()
  const [enrolling, setEnrolling] = useState<string | null>(null)

  const streak = calculateDailyStreak(state)
  const xp = state.progress.xp
  const level = state.progress.level
  const xpPercent = xpProgressPercent(xp, level)

  const handleEnroll = async (featureId: string) => {
    setEnrolling(featureId)
    await enrollInFeature(featureId)
    setEnrolling(null)
  }

  if (isConfigured && !user) {
    return (
      <AppShell>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
          <TargetIcon className="size-12 text-primary" />
          <h1 className="text-2xl font-semibold">Your Learning Profile</h1>
          <p className="text-muted-foreground">
            Sign in to save progress, build streaks, and sync across devices.
          </p>
          <Button render={<Link href="/sign-up" />}>
            Create free account
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </AppShell>
    )
  }

  const displayName = profile?.name ?? "Trader"
  const email = profile?.email ?? user?.email ?? ""

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {displayName}
            </h1>
            <p className="text-muted-foreground">{email}</p>
            {profile?.tradingExperience && (
              <Badge variant="outline" className="mt-2 capitalize">
                {profile.tradingExperience.replace(/-/g, " ")}
              </Badge>
            )}
          </div>
          <Button variant="outline" render={<Link href="/settings" />}>
            Settings
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Level" value={getLevelTitle(level)} subtext={`${xp} XP`} />
          <StatCard
            label="Daily Streak"
            value={`${streak} days`}
            subtext={streak > 0 ? "Keep it going!" : "Start today"}
          />
          <StatCard
            label="Weekly Target"
            value={
              state.weeklyTarget.daysPerWeek
                ? `${state.weeklyTarget.daysPerWeek} days/week`
                : "Not set"
            }
            subtext="Goal settings"
          />
          <StatCard
            label="Competence Score"
            value={`${competenceScores.overallScore}%`}
            subtext={PHASE_LABELS[state.liveTradingPhase.currentPhase]}
          />
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-4">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Level progress</span>
            <span className="font-medium">{xpPercent}%</span>
          </div>
          <Progress value={xpPercent} className="h-2" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <h2 className="font-semibold">Learning Statistics</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {state.lessonProgress.length}
                </p>
                <p className="text-muted-foreground">Lessons completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {state.quizAttempts.length}
                </p>
                <p className="text-muted-foreground">Quizzes completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {flashcardStats.totalReviewed}
                </p>
                <p className="text-muted-foreground">Flashcards reviewed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {state.drillSessions.length}
                </p>
                <p className="text-muted-foreground">Chart drills</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {trendSpotterStats.exercisesCompleted}
                </p>
                <p className="text-muted-foreground">Trend Spotter drills</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {strategyWikiStats.practiceSessions}
                </p>
                <p className="text-muted-foreground">Strategy exercises</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <h2 className="font-semibold">Skill Radar</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Behavioural competence blended with assessment results
            </p>
            <div className="mt-4">
              <SkillRadar
                scores={{
                  "market-knowledge": competenceScores.knowledgeScore,
                  "chart-reading": competenceScores.chartScore,
                  "trade-selection": competenceScores.tradeSelectionScore,
                  "risk-management": competenceScores.riskScore,
                  psychology: competenceScores.psychologyScore,
                  "strategy-mastery": competenceScores.executionScore,
                }}
              />
              <Button
                className="mt-4"
                size="sm"
                variant="outline"
                render={<Link href="/progression/live-transition" />}
              >
                View live trading path
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <h2 className="font-semibold">Course Enrollments</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enroll in learning areas to track your progress
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ENROLLABLE_FEATURES.map((feature) => {
              const Icon = featureIcons[feature.id] ?? LayersIcon
              const enrolled = enrollments.includes(feature.id)
              return (
                <div
                  key={feature.id}
                  className={cn(
                    "flex flex-col gap-3 rounded-lg border p-4",
                    enrolled ? "border-primary/30 bg-primary/5" : "border-border/60"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-primary" />
                    <span className="text-sm font-medium">{feature.title}</span>
                  </div>
                  {enrolled ? (
                    <Button size="sm" variant="outline" render={<Link href={feature.href} />}>
                      Continue
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={enrolling === feature.id}
                      onClick={() => handleEnroll(feature.id)}
                    >
                      {enrolling === feature.id ? "Enrolling..." : "Enroll"}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
