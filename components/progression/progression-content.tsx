"use client"

import Link from "next/link"
import {
  AwardIcon,
  BookOpenIcon,
  BrainIcon,
  CheckCircle2Icon,
  FlameIcon,
  GiftIcon,
  GraduationCapIcon,
  LockIcon,
  SparklesIcon,
  TrophyIcon,
  ZapIcon,
} from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getRankLadder } from "@/lib/progression"
import type { ChallengeSet } from "@/lib/progression"
import { cn } from "@/lib/utils"

export function ProgressionContent() {
  const { progression, claimChallenge } = useUserState()
  const { rank, competency, stats, challenges, achievements } = progression
  const ladder = getRankLadder()

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary">
            <TrophyIcon className="size-5" />
            <span className="text-sm font-medium">Trader Progression</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Your journey to professional trader
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Every lesson, quiz, drill, and simulation earns XP toward your
            Trader Rank. XP measures effort — your hidden Competency Score
            measures how well you actually know the material.
          </p>
        </header>

        <RankHero rank={rank} totalXp={stats.totalXP} />

        <StatGrid stats={stats} competency={competency.score} />

        <CompetencyCard competency={competency} />

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <GiftIcon className="size-5 text-emerald-500" />
            <h2 className="text-lg font-semibold">Challenges</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {challenges.map((c) => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                onClaim={() => claimChallenge(c.id)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SparklesIcon className="size-5 text-amber-400" />
              <h2 className="text-lg font-semibold">Achievements</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {progression.achievementsEarned}/{achievements.length} unlocked
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={cn(
                  "rounded-xl border p-4 transition-colors",
                  a.earned
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-border/60 bg-card/40 opacity-70"
                )}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{a.icon}</span>
                  {a.earned ? (
                    <CheckCircle2Icon className="size-4 text-amber-400" />
                  ) : (
                    <LockIcon className="size-3.5 text-muted-foreground" />
                  )}
                </div>
                <p className="mt-2 text-sm font-medium leading-tight">
                  {a.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {a.description}
                </p>
                <p className="mt-2 text-xs font-medium text-amber-500">
                  +{a.bonusXp} XP
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <AwardIcon className="size-5 text-fuchsia-400" />
            <h2 className="text-lg font-semibold">Trader Rank Ladder</h2>
          </div>
          <div className="overflow-hidden rounded-xl border border-border/60">
            {ladder.map(({ rank: r, floor }) => {
              const isCurrent = r.tier === rank.tier
              const isUnlocked = r.tier <= rank.tier
              return (
                <div
                  key={r.tier}
                  className={cn(
                    "flex items-center gap-4 border-b border-border/40 px-4 py-3 last:border-b-0",
                    isCurrent && "bg-primary/5"
                  )}
                >
                  <span className="text-xl">{r.insignia}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          !isUnlocked && "text-muted-foreground"
                        )}
                      >
                        {r.title}
                      </span>
                      {isCurrent && (
                        <Badge className="h-5 px-1.5 text-[10px]">Current</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {floor.toLocaleString()} XP · Rank {r.tier}
                    </p>
                  </div>
                  {isUnlocked ? (
                    <CheckCircle2Icon className="size-4 text-emerald-500" />
                  ) : (
                    <LockIcon className="size-3.5 text-muted-foreground" />
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </AppShell>
  )
}

function RankHero({
  rank,
  totalXp,
}: {
  rank: ReturnType<typeof useUserState>["progression"]["rank"]
  totalXp: number
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br p-6 sm:p-8",
        rank.rank.accent
      )}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-background/40 text-4xl backdrop-blur-sm">
            {rank.rank.insignia}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Rank {rank.tier} of 15
            </p>
            <h2 className="text-2xl font-bold tracking-tight">
              {rank.rank.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {totalXp.toLocaleString()} lifetime XP
            </p>
          </div>
        </div>

        <div className="w-full sm:max-w-xs">
          {rank.isMax ? (
            <p className="text-sm font-medium text-amber-500">
              🏆 Maximum rank reached — you are Legendary.
            </p>
          ) : (
            <>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Next: {rank.nextRank?.title}
                </span>
                <span className="font-medium">
                  {rank.xpToNext.toLocaleString()} XP to go
                </span>
              </div>
              <Progress value={rank.percentToNext} className="h-2" />
              <div className="mt-1.5 rounded-lg border border-border/50 bg-background/30 p-2 text-xs text-muted-foreground">
                Unlocks: {rank.nextRank?.benefits.join(" · ")}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function StatGrid({
  stats,
  competency,
}: {
  stats: ReturnType<typeof useUserState>["progression"]["stats"]
  competency: number
}) {
  const items = [
    { label: "Lifetime XP", value: stats.totalXP.toLocaleString(), icon: ZapIcon },
    { label: "Competency", value: `${competency}/100`, icon: BrainIcon },
    { label: "Current streak", value: `${stats.dailyStreak}d`, icon: FlameIcon },
    { label: "Longest streak", value: `${stats.longestStreak}d`, icon: FlameIcon },
    { label: "Lessons", value: stats.lessonsCompleted, icon: GraduationCapIcon },
    { label: "Books done", value: stats.booksCompleted, icon: BookOpenIcon },
    { label: "Quiz accuracy", value: `${stats.quizAccuracy}%`, icon: CheckCircle2Icon },
    { label: "Simulations", value: stats.simulationsCompleted, icon: TrophyIcon },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border/60 bg-card/50 p-4"
        >
          <item.icon className="size-4 text-muted-foreground" />
          <p className="mt-2 text-xl font-bold">{item.value}</p>
          <p className="text-xs text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

function CompetencyCard({
  competency,
}: {
  competency: ReturnType<typeof useUserState>["progression"]["competency"]
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <BrainIcon className="size-4" /> Hidden Competency Score
          </p>
          <p className="text-4xl font-bold text-primary">
            {competency.score}
            <span className="text-lg text-muted-foreground">/100</span>
          </p>
          <Badge variant="outline">{competency.label}</Badge>
          <p className="max-w-md text-sm text-muted-foreground">
            How well you actually know the material — weighted toward quiz
            accuracy, simulations and exams, so it can&apos;t be farmed through
            passive repetition.
          </p>
        </div>
        <div className="w-full max-w-sm space-y-3">
          {competency.breakdown.map((b) => (
            <div key={b.key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className={cn(!b.hasData && "text-muted-foreground")}>
                  {b.label}
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({Math.round(b.weight * 100)}%)
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {b.hasData
                    ? `${b.quality}% acc · ${b.coverage}% covered`
                    : "Not started"}
                </span>
              </div>
              <Progress value={b.hasData ? b.coverage : 0} className="h-1.5" />
            </div>
          ))}
          <p className="pt-1 text-xs text-muted-foreground">
            Competency grows as you master more of the material — accuracy alone
            isn&apos;t enough, you have to cover the breadth too.
          </p>
        </div>
      </div>
    </div>
  )
}

function ChallengeCard({
  challenge,
  onClaim,
}: {
  challenge: ChallengeSet
  onClaim: () => void
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-5",
        challenge.claimable
          ? "border-emerald-500/40 bg-emerald-500/5"
          : "border-border/60 bg-card/50"
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{challenge.title}</h3>
        <Badge variant="outline" className="text-[10px]">
          +{challenge.rewardXp} XP
        </Badge>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {challenge.completed}/{challenge.total} objectives
      </p>

      <div className="mt-3 flex-1 space-y-2.5">
        {challenge.objectives.map((o) => (
          <div key={o.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span
                className={cn(
                  "flex items-center gap-1.5",
                  o.done && "text-emerald-500"
                )}
              >
                {o.done ? (
                  <CheckCircle2Icon className="size-3.5" />
                ) : (
                  <span className="inline-block size-3.5 rounded-full border border-border" />
                )}
                {o.label}
              </span>
              <span className="text-muted-foreground">
                {o.current}/{o.target}
              </span>
            </div>
            <Progress
              value={Math.round((o.current / o.target) * 100)}
              className="h-1"
            />
          </div>
        ))}
      </div>

      <Button
        className="mt-4"
        size="sm"
        disabled={!challenge.claimable}
        onClick={onClaim}
      >
        {challenge.claimed
          ? "Reward claimed"
          : challenge.claimable
            ? `Claim +${challenge.rewardXp} XP`
            : "In progress"}
      </Button>
    </div>
  )
}
