"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  BrainIcon,
  CandlestickChartIcon,
  InfoIcon,
  LayersIcon,
  LockIcon,
  RotateCcwIcon,
  ShieldIcon,
  SparklesIcon,
} from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { LockedContentModal } from "@/components/learning-map/learning-map-modals"
import { useUserState } from "@/components/providers/user-state-provider"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  FLASHCARDS_DISCLAIMER,
  getAllFlashcardDecks,
  getDeckFlashcards,
} from "@/content/flashcards"
import {
  getFlashcardDeckAccess,
  getFlashcardDeckLockInfo,
} from "@/lib/learning-map/deck-access"
import { useState } from "react"

const SPECIAL_DECKS = [
  {
    mode: "weak",
    title: "Weak areas",
    description: "Cards you marked nearly or missed.",
    icon: RotateCcwIcon,
  },
  {
    mode: "missed",
    title: "Recently missed",
    description: "Focus on concepts that need another pass.",
    icon: BrainIcon,
  },
  {
    mode: "chart",
    title: "Chart cards",
    description: "Interactive chart recognition drills.",
    icon: CandlestickChartIcon,
  },
  {
    mode: "icc",
    title: "ICC cards",
    description: "Indication, correction, continuation recall.",
    icon: LayersIcon,
  },
  {
    mode: "risk",
    title: "Risk cards",
    description: "Stops, sizing, and account protection.",
    icon: ShieldIcon,
  },
  {
    mode: "book-lab",
    title: "Book Lab cards",
    description: "Day trading concepts from Book Lab.",
    icon: SparklesIcon,
  },
] as const

export function FlashcardsContent() {
  const { flashcardStats, state } = useUserState()
  const decks = getAllFlashcardDecks()
  const [lockedDeck, setLockedDeck] = useState<string | null>(null)
  const hasProgress = flashcardStats.totalReviewed > 0
  const weakAreasUnlocked =
    flashcardStats.totalReviewed >= 5 ||
    state.quizAttempts.length > 0 ||
    state.drillSessions.length > 0
  const masteryPercent =
    flashcardStats.totalCards > 0
      ? Math.round(
          (flashcardStats.masteredCount / flashcardStats.totalCards) * 100
        )
      : 0

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary">
            <LayersIcon className="size-5" />
            <span className="text-sm font-medium">Flashcards</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Flashcards
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Review trading concepts in quick 10-card practice rounds.
          </p>
          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/70">
            <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
            {FLASHCARDS_DISCLAIMER}
          </p>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <p className="text-sm font-medium text-primary">Game of 10</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasProgress
              ? "Mixed review from due cards, weak areas, and new concepts."
              : "Start your first 10-card review with Trading Basics and core concepts."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button render={<Link href="/flashcards/session?mode=game10" />}>
              Start 10-card review
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            {!hasProgress && (
              <Button
                variant="outline"
                render={
                  <Link href="/flashcards/session?deck=trading-basics" />
                }
              >
                Trading Basics deck
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <p className="text-sm font-medium">Progress summary</p>
          {hasProgress ? (
            <div className="mt-3 flex flex-col gap-3">
              <div className="flex flex-wrap gap-4 text-sm">
                <span>
                  <span className="text-muted-foreground">Reviewed: </span>
                  {flashcardStats.totalReviewed}
                </span>
                <span>
                  <span className="text-muted-foreground">Mastered: </span>
                  {flashcardStats.masteredCount}
                </span>
                <span>
                  <span className="text-muted-foreground">Due today: </span>
                  {flashcardStats.dueCount}
                </span>
                <span>
                  <span className="text-muted-foreground">Weak: </span>
                  {flashcardStats.weakCount}
                </span>
                <span>
                  <span className="text-muted-foreground">Sessions: </span>
                  {flashcardStats.sessionsCompleted}
                </span>
              </div>
              <Progress value={masteryPercent} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {masteryPercent}% of cards mastered
              </p>
            </div>
          ) : (
            <EmptyState
              icon={LayersIcon}
              title="No flashcard progress yet"
              description="Starter decks are ready. Complete a 10-card session to begin tracking recall."
              action={
                <Button
                  size="sm"
                  render={<Link href="/flashcards/session?deck=trading-basics" />}
                >
                  Start your first 10-card review
                </Button>
              }
            />
          )}
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">Focus decks</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SPECIAL_DECKS.map((deck) => {
              const Icon = deck.icon
              const needsWeakData =
                deck.mode === "weak" || deck.mode === "missed"
              const locked = needsWeakData && !weakAreasUnlocked

              const inner = (
                <>
                  <div className="flex items-center gap-2 text-primary">
                    <Icon className="size-4" />
                    <span className="font-medium">{deck.title}</span>
                    {locked && <LockIcon className="size-3.5 text-muted-foreground" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {locked
                      ? "Complete quizzes or drills first to build weak-area data."
                      : deck.description}
                  </p>
                </>
              )

              if (locked) {
                return (
                  <div
                    key={deck.mode}
                    className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-4"
                  >
                    {inner}
                  </div>
                )
              }

              return (
                <Link
                  key={deck.mode}
                  href={`/flashcards/session?mode=${deck.mode}`}
                  className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/50 p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  {inner}
                </Link>
              )
            })}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">Choose a deck</h2>
          <p className="text-xs text-muted-foreground">
            Starter decks are always open. Advanced decks unlock as you progress on the Learning Map.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {decks.map((deck) => {
              const count = getDeckFlashcards(deck.slug).length
              const access = getFlashcardDeckAccess(state, deck.slug)
              const isLocked = access === "locked"

              const inner = (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{deck.title}</span>
                    <div className="flex items-center gap-1.5">
                      {isLocked && <LockIcon className="size-3.5 text-muted-foreground" />}
                      {access === "preview" && (
                        <Badge variant="outline" className="text-[10px]">
                          Preview
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-[10px] capitalize">
                        {deck.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{deck.description}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {count} cards · {deck.category}
                    {isLocked && " · Locked"}
                  </p>
                </>
              )

              if (isLocked) {
                return (
                  <button
                    key={deck.id}
                    type="button"
                    onClick={() => setLockedDeck(deck.slug)}
                    className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-4 text-left transition-colors hover:border-border"
                  >
                    {inner}
                  </button>
                )
              }

              return (
                <Link
                  key={deck.id}
                  href={`/flashcards/session?deck=${deck.slug}`}
                  className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/50 p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  {inner}
                </Link>
              )
            })}
          </div>
        </section>

        {lockedDeck && (
          <LockedContentModal
            open={Boolean(lockedDeck)}
            onOpenChange={(open) => !open && setLockedDeck(null)}
            title="This deck is locked for now"
            lockInfo={getFlashcardDeckLockInfo(state, lockedDeck)}
          />
        )}
      </div>
    </AppShell>
  )
}
