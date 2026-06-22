"use client"

import Link from "next/link"
import { RotateCcwIcon, TrophyIcon } from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { EmptyState } from "@/components/shared/empty-state"
import { StatCard } from "@/components/shared/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { badgeDefinitions } from "@/lib/mock-data"
import { getLevelTitle, getXpProgressPercent } from "@/lib/user-state"
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"

export function ProgressContent() {
  const { stats, state, hasBadge, reset } = useUserState()
  const xpPercent = getXpProgressPercent(state.progress)
  const isNewUser =
    state.lessonProgress.length === 0 &&
    state.quizAttempts.length === 0 &&
    state.drillSessions.length === 0

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Your Progress
            </h1>
            <p className="text-muted-foreground">
              XP, badges, and skills — updated only from your activity
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcwIcon data-icon="inline-start" />
            Reset progress (dev)
          </Button>
        </div>

        {isNewUser && (
          <EmptyState
            icon={TrophyIcon}
            title="No progress yet"
            description="Complete a lesson, quiz, or chart drill to start tracking your progress."
            action={
              <Button render={<Link href="/paths/trading-foundations" />}>
                Start Trading Foundations
              </Button>
            }
          />
        )}

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Level {stats.level} · {getLevelTitle(stats.level)}
              </p>
              <p className="font-medium">
                {stats.xp} / {stats.xpForNextLevel} XP
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.streak > 0
                ? `🔥 ${stats.streak}-day streak`
                : "No streak yet — practice today to start one"}
            </p>
          </div>
          <Progress value={xpPercent} className="mt-4 h-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Lessons Completed"
            value={String(stats.lessonsCompleted)}
            subtext={`of ${stats.totalLessons} available`}
            trend={stats.lessonsCompleted > 0 ? "up" : "neutral"}
          />
          <StatCard
            label="Quizzes Completed"
            value={String(stats.quizzesCompleted)}
            subtext={
              stats.quizzesCompleted > 0
                ? `${stats.quizAverageScore}% avg score`
                : "No quizzes yet"
            }
            trend={stats.quizzesCompleted > 0 ? "up" : "neutral"}
          />
          <StatCard
            label="Drills Completed"
            value={String(stats.drillsCompleted)}
            subtext={
              stats.drillsCompleted > 0
                ? `${stats.accuracy}% avg score`
                : "No drills yet"
            }
            trend={stats.drillsCompleted > 0 ? "up" : "neutral"}
          />
        </div>

        {stats.drillsCompleted > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-2 text-primary">
                <ThumbsUpIcon />
                <h2 className="font-medium">Keep going</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                You&apos;ve completed {stats.drillsCompleted} chart drill
                {stats.drillsCompleted === 1 ? "" : "s"}. Consistent practice
                builds pattern recognition.
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/50 p-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ThumbsDownIcon />
                <h2 className="font-medium">Focus area</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Complete more drills to identify areas for improvement.
              </p>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <h2 className="font-medium">Badges</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {badgeDefinitions.map((badge) => {
              const earned = hasBadge(badge.id)
              return (
                <div
                  key={badge.id}
                  className={`flex items-start gap-3 rounded-lg border p-4 ${
                    earned
                      ? "border-primary/20 bg-primary/5"
                      : "border-border/60 opacity-60"
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{badge.name}</p>
                      {earned ? (
                        <Badge
                          variant="secondary"
                          className="border-primary/20 bg-primary/10 text-xs text-primary"
                        >
                          Earned
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Locked
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {badge.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
