"use client"

import { useState } from "react"
import { CrownIcon, FlameIcon, MedalIcon, TrophyIcon } from "lucide-react"

import { useLeaderboard } from "@/components/leaderboard/use-leaderboard"
import { AppShell } from "@/components/layout/app-shell"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LEADERBOARD_PERIOD_LABELS,
  type LeaderboardEntry,
  type LeaderboardPeriod,
} from "@/lib/leaderboard"
import { cn } from "@/lib/utils"

const PERIODS: LeaderboardPeriod[] = ["daily", "weekly", "monthly", "all-time"]

export function LeaderboardContent() {
  const [period, setPeriod] = useState<LeaderboardPeriod>("weekly")
  const board = useLeaderboard(period)

  const podium = board.entries.slice(0, 3)
  const rest = board.entries.slice(3)
  const isPeriodXp = period !== "all-time"

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-400">
            <TrophyIcon className="size-5" />
            <span className="text-sm font-medium">Leaderboards</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Compete with traders worldwide
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Climb the ranks by earning XP. Boards reset daily, weekly, and
            monthly — consistency wins.
          </p>
        </header>

        <Tabs
          value={period}
          onValueChange={(v) => setPeriod(v as LeaderboardPeriod)}
        >
          <TabsList className="w-full sm:w-auto">
            {PERIODS.map((p) => (
              <TabsTrigger key={p} value={p}>
                {LEADERBOARD_PERIOD_LABELS[p]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {board.currentUserEntry && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{board.currentUserEntry.avatar}</span>
                <div>
                  <p className="text-sm font-semibold">
                    You — {board.currentUserEntry.rankTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rank #{board.currentUserRank} ·{" "}
                    {isPeriodXp
                      ? `${board.currentUserEntry.periodXp.toLocaleString()} XP ${LEADERBOARD_PERIOD_LABELS[period].toLowerCase()}`
                      : `${board.currentUserEntry.xp.toLocaleString()} XP`}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="gap-1">
                <FlameIcon className="size-3" />
                {board.currentUserEntry.streak}d
              </Badge>
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          {podium.map((entry) => (
            <PodiumCard key={entry.id} entry={entry} isPeriodXp={isPeriodXp} />
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-border/60">
          <div className="hidden items-center gap-4 border-b border-border/60 bg-muted/30 px-4 py-2.5 text-xs font-medium text-muted-foreground sm:flex">
            <span className="w-8">#</span>
            <span className="flex-1">Trader</span>
            <span className="w-28">Rank</span>
            <span className="w-16 text-right">Streak</span>
            <span className="w-24 text-right">XP</span>
          </div>
          {rest.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              {board.isDemoBoard
                ? "Demo leaderboard preview."
                : "No other public leaderboard entries yet. Opt in under Settings → Privacy to appear here."}
            </p>
          ) : (
            rest.map((entry) => (
              <LeaderboardRow
                key={entry.id}
                entry={entry}
                isPeriodXp={isPeriodXp}
              />
            ))
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {board.isDemoBoard
            ? "Preview board with sample traders — sign in to track your real XP."
            : "Only traders who opted into public leaderboards appear here. Your email is never shown."}
        </p>
      </div>
    </AppShell>
  )
}

function PodiumCard({
  entry,
  isPeriodXp,
}: {
  entry: LeaderboardEntry
  isPeriodXp: boolean
}) {
  const place = entry.rank
  const styles = {
    1: "border-amber-500/40 bg-amber-500/10",
    2: "border-zinc-400/40 bg-zinc-400/10",
    3: "border-orange-700/40 bg-orange-700/10",
  }[place as 1 | 2 | 3]

  return (
    <div
      className={cn(
        "rounded-xl border p-4 text-center",
        styles,
        entry.isCurrentUser && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-center justify-center gap-1">
        {place === 1 ? (
          <CrownIcon className="size-4 text-amber-400" />
        ) : (
          <MedalIcon
            className={cn(
              "size-4",
              place === 2 ? "text-zinc-300" : "text-orange-500"
            )}
          />
        )}
        <span className="text-xs font-bold">#{place}</span>
      </div>
      <div className="mt-2 text-3xl">{entry.avatar}</div>
      <p className="mt-1 truncate text-sm font-semibold">
        {entry.username} {entry.country}
      </p>
      <p className="text-xs text-muted-foreground">
        {entry.insignia} {entry.rankTitle}
      </p>
      <p className="mt-2 text-lg font-bold">
        {(isPeriodXp ? entry.periodXp : entry.xp).toLocaleString()}
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          XP
        </span>
      </p>
    </div>
  )
}

function LeaderboardRow({
  entry,
  isPeriodXp,
}: {
  entry: LeaderboardEntry
  isPeriodXp: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 border-b border-border/40 px-4 py-3 text-sm last:border-b-0",
        entry.isCurrentUser && "bg-primary/5 font-medium"
      )}
    >
      <span className="w-8 text-muted-foreground">{entry.rank}</span>
      <span className="flex flex-1 items-center gap-2 truncate">
        <span className="text-lg">{entry.avatar}</span>
        <span className="truncate">
          {entry.isCurrentUser ? "You" : entry.username}
        </span>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {entry.country}
        </span>
      </span>
      <span className="hidden w-28 items-center gap-1 text-xs text-muted-foreground sm:flex">
        <span>{entry.insignia}</span>
        <span className="truncate">{entry.rankTitle}</span>
      </span>
      <span className="flex w-16 items-center justify-end gap-1 text-xs text-muted-foreground">
        <FlameIcon className="size-3" />
        {entry.streak}
      </span>
      <span className="w-24 text-right font-semibold">
        {(isPeriodXp ? entry.periodXp : entry.xp).toLocaleString()}
      </span>
    </div>
  )
}
