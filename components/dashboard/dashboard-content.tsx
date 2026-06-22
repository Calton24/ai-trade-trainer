"use client"

import Link from "next/link"
import { ArrowRightIcon, BookOpenIcon, FlameIcon, MapIcon, SparklesIcon } from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { EmptyState } from "@/components/shared/empty-state"
import { StatCard } from "@/components/shared/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { badgeDefinitions } from "@/lib/mock/badges"
import {
  getLessonById,
  getPathBySlug,
} from "@/content/registry"
import { getLevelTitle, getXpProgressPercent } from "@/lib/user-state"

export function DashboardContent() {
  const { stats, state, pathProgress, hasBadge } = useUserState()
  const xpPercent = getXpProgressPercent(state.progress)
  const activePath = stats.activePathId
    ? getPathBySlug(stats.activePathId)
    : null
  const nextItem = stats.nextSyllabusItemId
    ? getLessonById(stats.nextSyllabusItemId)
    : null
  const recommendedLesson = getLessonById(stats.recommendedLessonId)
  const recommendedHref = recommendedLesson
    ? `/paths/${getPathBySlug(recommendedLesson.pathId)?.slug ?? recommendedLesson.pathId}/lessons/${recommendedLesson.slug}`
    : "/paths/trading-foundations"
  const earnedBadges = badgeDefinitions.filter((b) => hasBadge(b.id))
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
              {isNewUser ? "Welcome to TradeTrainer AI" : "Welcome back"}
            </h1>
            <p className="text-muted-foreground">{stats.recommendedAction}</p>
          </div>
          <Button render={<Link href="/paths" />}>
            {isNewUser ? "Choose Your First Path" : "Continue Path"}
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>

        {isNewUser && (
          <EmptyState
            icon={MapIcon}
            title="You haven't started learning yet"
            description="Choose your first path to begin. We recommend Trading Foundations for absolute beginners."
            action={
              <Button render={<Link href="/paths/trading-foundations" />}>
                Start Trading Foundations
              </Button>
            }
          />
        )}

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <SparklesIcon className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Level {stats.level}
                </span>
              </div>
              <h2 className="text-xl font-semibold">
                {getLevelTitle(stats.level)}
              </h2>
              <p className="text-sm text-muted-foreground">
                {stats.xp} / {stats.xpForNextLevel} XP
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-4 py-2">
              <FlameIcon className="text-muted-foreground" />
              <span className="text-sm font-medium">
                {stats.streak > 0
                  ? `${stats.streak}-day streak`
                  : "No streak yet"}
              </span>
            </div>
          </div>
          <Progress value={xpPercent} className="mt-4 h-2" />
        </div>

        {activePath && state.progress.activePathId && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-2 text-primary">
              <MapIcon />
              <span className="text-sm font-medium">Active learning path</span>
            </div>
            <h3 className="mt-2 font-medium">{activePath.title}</h3>
            <Progress
              value={pathProgress(activePath.id)}
              className="mt-3 h-2"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {pathProgress(activePath.id)}% complete
              {nextItem && ` · Next: ${nextItem.title}`}
            </p>
            <Button
              className="mt-4"
              size="sm"
              render={<Link href={`/paths/${activePath.slug}`} />}
            >
              View Syllabus
            </Button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Lessons Completed"
            value={`${stats.lessonsCompleted}/${stats.totalLessons}`}
            subtext="Across all paths"
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
          <StatCard
            label="Weakest Skill"
            value={
              stats.drillsCompleted > 0 ? stats.weakestSkill || "—" : "—"
            }
            subtext={
              stats.drillsCompleted > 0 ? "Focus area" : "Complete drills to see"
            }
            trend="neutral"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {recommendedLesson && (
            <div className="rounded-xl border border-border/60 bg-card/50 p-6">
              <p className="text-sm font-medium text-primary">
                {stats.lessonsCompleted === 0
                  ? "Recommended first lesson"
                  : "Recommended lesson"}
              </p>
              <h3 className="mt-2 font-medium">{recommendedLesson.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {recommendedLesson.description}
              </p>
              <Button className="mt-4" render={<Link href={recommendedHref} />}>
                Start Lesson
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </div>
          )}

          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <h2 className="font-medium">Quick Actions</h2>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant="outline"
                className="justify-start"
                render={<Link href="/training" />}
              >
                Start a chart drill
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                render={<Link href="/quizzes" />}
              >
                Take a quiz
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                render={<Link href="/learn" />}
              >
                <BookOpenIcon data-icon="inline-start" />
                Browse lesson library
              </Button>
            </div>
          </div>
        </div>

        {earnedBadges.length > 0 ? (
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <h2 className="font-medium">Your Badges</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {earnedBadges.map((badge) => (
                <Badge
                  key={badge.id}
                  variant="secondary"
                  className="border-primary/20 bg-primary/10 px-3 py-1.5 text-primary"
                >
                  {badge.icon} {badge.name}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/60 bg-card/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No badges earned yet. Complete lessons and drills to unlock your
              first badge.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
