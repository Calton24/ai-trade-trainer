"use client"

import Link from "next/link"
import { ArrowRightIcon, BookOpenIcon } from "lucide-react"

import { masteryLabel } from "@/lib/strategy-wiki/mastery"
import type { MasteryLevel, TradingStrategy } from "@/lib/strategy-wiki/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StrategyCardProps {
  strategy: TradingStrategy
  masteryLevel?: MasteryLevel
  href?: string
}

function difficultyLabel(d: TradingStrategy["difficulty"]) {
  if (d === "beginner-intermediate") return "Beginner–Intermediate"
  return d.charAt(0).toUpperCase() + d.slice(1)
}

export function StrategyCard({
  strategy,
  masteryLevel = "not_started",
  href,
}: StrategyCardProps) {
  const link = href ?? `/strategy-wiki/${strategy.slug}`

  return (
    <Link
      href={link}
      className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-card/50 p-5 transition-colors hover:border-primary/40 hover:bg-card"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold group-hover:text-primary">{strategy.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{strategy.category}</p>
        </div>
        <Badge variant="outline" className="shrink-0 text-[10px]">
          {difficultyLabel(strategy.difficulty)}
        </Badge>
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground">{strategy.summary}</p>
      <div className="flex items-center justify-between">
        <Badge
          variant="secondary"
          className={cn(
            "text-[10px]",
            masteryLevel === "mastered" && "bg-primary/20 text-primary",
            masteryLevel === "competent" && "bg-emerald-500/10 text-emerald-400",
            masteryLevel === "strong" && "bg-blue-500/10 text-blue-400"
          )}
        >
          {masteryLabel(masteryLevel)}
        </Badge>
        <ArrowRightIcon className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  )
}

export function StrategyMasteryBadge({ level }: { level: MasteryLevel }) {
  return (
    <Badge variant="outline" className="text-xs">
      {masteryLabel(level)}
    </Badge>
  )
}

export function StrategyFlashcardCTA({
  deckSlug,
  strategyTitle,
}: {
  deckSlug?: string
  strategyTitle: string
}) {
  if (!deckSlug) return null
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <div className="flex items-center gap-2 text-primary">
        <BookOpenIcon className="size-4" />
        <span className="text-sm font-medium">Flashcard review</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Review flashcards for {strategyTitle} to lock in the setup steps.
      </p>
      <Button
        className="mt-4"
        size="sm"
        variant="outline"
        render={
          <Link href={`/flashcards/session?mode=game10&deck=${deckSlug}`} />
        }
      >
        Review 10 flashcards
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
    </div>
  )
}
