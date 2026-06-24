"use client"

import Link from "next/link"
import { RotateCcwIcon, TrophyIcon } from "lucide-react"

import { WeeklyTargetWidget } from "@/components/habits/weekly-target-widget"
import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { EmptyState } from "@/components/shared/empty-state"
import { StatCard } from "@/components/shared/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { badgeDefinitions } from "@/lib/mock/badges"
import { getLevelTitle, getXpProgressPercent } from "@/lib/user-state"
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"

export function ProgressContent() {
  const {
    stats,
    state,
    hasBadge,
    bookLabStats,
    flashcardStats,
    trendSpotterStats,
    strategyWikiStats,
    globalSnapshot,
    reset,
  } = useUserState()
  const xpPercent = getXpProgressPercent(state.progress)
  const isNewUser = globalSnapshot.totalActivities === 0

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
              {globalSnapshot.dailyStreak > 0
                ? `${globalSnapshot.dailyStreak}-day streak`
                : "No streak yet — practice today to start one"}
            </p>
          </div>
          <Progress value={xpPercent} className="mt-4 h-2" />
        </div>

        {!isNewUser && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-card/50 p-6">
              <WeeklyTargetWidget />
              {globalSnapshot.weeklyStreak > 0 && (
                <p className="mt-3 text-xs text-primary">
                  {globalSnapshot.weeklyStreak}-week streak
                </p>
              )}
            </div>
            <div className="rounded-xl border border-border/60 bg-card/50 p-6">
              <p className="text-sm font-medium">Recent activity</p>
              <ul className="mt-3 flex flex-col gap-2">
                {state.activityLog.slice(0, 6).map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between text-xs text-muted-foreground"
                  >
                    <span>{a.title}</span>
                    <span className="capitalize">{a.source}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Lessons Completed"
            value={String(stats.lessonsCompleted)}
            subtext={`of ${stats.totalLessons} available`}
            trend={stats.lessonsCompleted > 0 ? "up" : "neutral"}
          />
          <StatCard
            label="Book Lab"
            value={`${bookLabStats.conceptsCompleted}/${bookLabStats.totalConcepts}`}
            subtext="Concepts completed"
            trend={bookLabStats.conceptsCompleted > 0 ? "up" : "neutral"}
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
          <StatCard
            label="Flashcards"
            value={
              flashcardStats.totalReviewed > 0
                ? `${flashcardStats.masteredCount} mastered`
                : "—"
            }
            subtext={
              flashcardStats.totalReviewed > 0
                ? `${flashcardStats.totalReviewed} reviewed · ${flashcardStats.sessionsCompleted} sessions`
                : "No flashcard sessions yet"
            }
            trend={flashcardStats.totalReviewed > 0 ? "up" : "neutral"}
          />
          <StatCard
            label="Trend Spotter"
            value={
              trendSpotterStats.lessonsCompleted > 0 ||
              trendSpotterStats.exercisesCompleted > 0
                ? `${trendSpotterStats.classificationAccuracy}%`
                : "—"
            }
            subtext={
              trendSpotterStats.lessonsCompleted > 0
                ? `${trendSpotterStats.lessonsCompleted} lessons · ${trendSpotterStats.exercisesCompleted} exercises`
                : "Train trend recognition"
            }
            trend={
              trendSpotterStats.exercisesCompleted > 0 ? "up" : "neutral"
            }
          />
          <StatCard
            label="Strategy Wiki"
            value={
              strategyWikiStats.practiceSessions > 0 ||
              strategyWikiStats.lessonsCompleted > 0
                ? strategyWikiStats.averageScore > 0
                  ? `${strategyWikiStats.averageScore}%`
                  : `${strategyWikiStats.lessonsCompleted} read`
                : "—"
            }
            subtext={
              strategyWikiStats.practiceSessions > 0
                ? `${strategyWikiStats.practiceSessions} drills · ${strategyWikiStats.strategiesStarted}/${strategyWikiStats.totalStrategies} started`
                : strategyWikiStats.lessonsCompleted > 0
                  ? `${strategyWikiStats.lessonsCompleted} playbooks read`
                  : "Learn setups step by step"
            }
            trend={
              strategyWikiStats.practiceSessions > 0 ? "up" : "neutral"
            }
          />
        </div>

        {(strategyWikiStats.practiceSessions > 0 ||
          strategyWikiStats.lessonsCompleted > 0) && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <p className="text-sm font-medium">Strategy Wiki</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                {strategyWikiStats.lessonsCompleted} playbook
                {strategyWikiStats.lessonsCompleted === 1 ? "" : "s"} read
              </span>
              <span>
                {strategyWikiStats.practiceSessions} practice session
                {strategyWikiStats.practiceSessions === 1 ? "" : "s"}
              </span>
              {strategyWikiStats.challengeSessions > 0 && (
                <span>
                  {strategyWikiStats.challengeSessions} challenge
                  {strategyWikiStats.challengeSessions === 1 ? "" : "s"}
                </span>
              )}
              {strategyWikiStats.strategiesMastered > 0 && (
                <span className="text-primary">
                  {strategyWikiStats.strategiesMastered} mastered
                </span>
              )}
              {strategyWikiStats.weakestStrategyTitle && (
                <span>Weakest: {strategyWikiStats.weakestStrategyTitle}</span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                render={
                  <Link
                    href={
                      strategyWikiStats.recommendedStrategySlug
                        ? `/strategy-wiki/${strategyWikiStats.recommendedStrategySlug}/practice`
                        : "/strategy-wiki"
                    }
                  />
                }
              >
                {strategyWikiStats.recommendedStrategyTitle
                  ? `Practise ${strategyWikiStats.recommendedStrategyTitle}`
                  : "Open Strategy Wiki"}
              </Button>
              {strategyWikiStats.recommendedStrategySlug && (
                <Button
                  size="sm"
                  variant="outline"
                  render={
                    <Link
                      href={`/strategy-wiki/${strategyWikiStats.recommendedStrategySlug}/challenge`}
                    />
                  }
                >
                  10-scenario challenge
                </Button>
              )}
            </div>
          </div>
        )}

        {(trendSpotterStats.lessonsCompleted > 0 ||
          trendSpotterStats.exercisesCompleted > 0) && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <p className="text-sm font-medium">Trend Spotter</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                {trendSpotterStats.challengesCompleted} challenge
                {trendSpotterStats.challengesCompleted === 1 ? "" : "s"}
              </span>
              {trendSpotterStats.weakestType && (
                <span className="capitalize">
                  Weakest: {trendSpotterStats.weakestType}
                </span>
              )}
              {trendSpotterStats.strongestType && (
                <span className="capitalize">
                  Strongest: {trendSpotterStats.strongestType}
                </span>
              )}
            </div>
            <Button
              className="mt-4"
              size="sm"
              render={<Link href="/trend-spotter/challenge" />}
            >
              10-chart challenge
            </Button>
          </div>
        )}

        {flashcardStats.totalReviewed > 0 && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <p className="text-sm font-medium">Flashcard recall</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{flashcardStats.dueCount} due today</span>
              <span>{flashcardStats.weakCount} weak areas</span>
              <span>
                {flashcardStats.masteredCount}/{flashcardStats.totalCards} mastered
              </span>
            </div>
            <Button
              className="mt-4"
              size="sm"
              render={<Link href="/flashcards/session?mode=game10" />}
            >
              Start 10-card review
            </Button>
          </div>
        )}

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
