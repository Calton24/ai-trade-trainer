"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowRightIcon, RotateCcwIcon, TrophyIcon } from "lucide-react"

import {
  ConfidenceButtons,
  FlashcardCardView,
} from "@/components/flashcards/flashcard-card-view"
import { AppShell } from "@/components/layout/app-shell"
import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { buildSessionDeck, getFlashcardDeck } from "@/content/flashcards"
import type { Flashcard, FlashcardConfidence } from "@/lib/flashcards/types"
import { ProgressionGate } from "@/components/learning-map/progression-gate"
import {
  getFlashcardDeckAccess,
  getFlashcardDeckLockInfo,
} from "@/lib/learning-map/deck-access"
import { calculateDailyStreak } from "@/lib/user-state"

const SESSION_SIZE = 10

export function FlashcardSession() {
  const searchParams = useSearchParams()
  const deckSlug = searchParams.get("deck")
  const mode = searchParams.get("mode") ?? (deckSlug ? "deck" : "game10")

  const {
    state,
    recordFlashcardReview,
    finishFlashcardSession,
  } = useUserState()

  const cards = useMemo(
    () =>
      buildSessionDeck(
        mode,
        deckSlug,
        state.flashcards.cardProgress,
        SESSION_SIZE
      ),
    [mode, deckSlug, state.flashcards.cardProgress]
  )

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [gotIt, setGotIt] = useState(0)
  const [nearly, setNearly] = useState(0)
  const [missed, setMissed] = useState(0)
  const [missedIds, setMissedIds] = useState<string[]>([])
  const [finished, setFinished] = useState(false)
  const [sessionSaved, setSessionSaved] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)

  const card: Flashcard | undefined = cards[index]
  const deck = deckSlug ? getFlashcardDeck(deckSlug) : null
  const progress = cards.length > 0 ? ((index + 1) / cards.length) * 100 : 0

  if (deckSlug) {
    const access = getFlashcardDeckAccess(state, deckSlug)
    const lockInfo = getFlashcardDeckLockInfo(state, deckSlug)
    if (access !== "unlocked") {
      return (
        <AppShell>
          <div className="mx-auto max-w-lg py-8">
            <ProgressionGate
              access={access}
              title={`${deck?.title ?? "Deck"} — Flashcards`}
              lockInfo={lockInfo}
              previewContent={
                access === "preview" ? (
                  <p className="text-sm text-muted-foreground">
                    Preview the deck list on the Flashcards page. Complete prerequisites
                    on the Learning Map to run a full review session.
                  </p>
                ) : undefined
              }
            >
              <></>
            </ProgressionGate>
            <Button className="mt-4" variant="outline" render={<Link href="/flashcards" />}>
              Back to Flashcards
            </Button>
          </div>
        </AppShell>
      )
    }
  }

  const handleConfidence = useCallback(
    (confidence: FlashcardConfidence) => {
      if (!card || finished) return

      recordFlashcardReview(card.id, confidence)

      if (confidence === "got_it") setGotIt((g) => g + 1)
      else if (confidence === "nearly") setNearly((n) => n + 1)
      else {
        setMissed((m) => m + 1)
        setMissedIds((ids) => [...ids, card.id])
      }

      if (index >= cards.length - 1) {
        setFinished(true)
      } else {
        setIndex((i) => i + 1)
        setFlipped(false)
        setSelectedOption(null)
        setShowAnswer(false)
      }
    },
    [card, finished, index, cards.length, recordFlashcardReview]
  )

  const handleConfidenceRef = useRef(handleConfidence)
  handleConfidenceRef.current = handleConfidence

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (finished) return
      const needsReveal =
        card?.type === "basic" ||
        card?.type === "scenario" ||
        (card?.type === "chart" && !flipped)
      if (needsReveal && !flipped && !showAnswer) return
      if (e.key === "1") handleConfidenceRef.current("missed")
      if (e.key === "2") handleConfidenceRef.current("nearly")
      if (e.key === "3") handleConfidenceRef.current("got_it")
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [finished, card, flipped, showAnswer])

  useEffect(() => {
    if (!finished || sessionSaved) return

    const total = gotIt + nearly + missed
    const xp = gotIt * 8 + nearly * 4 + 10
    setXpEarned(xp)

    finishFlashcardSession({
      deckId: deckSlug ?? mode,
      mode: mode === "game10" || total >= 10 ? "game10" : mode,
      cardsReviewed: total,
      gotIt,
      nearly,
      missed,
      score: gotIt,
      xpEarned: xp,
    })
    setSessionSaved(true)
  }, [
    finished,
    sessionSaved,
    gotIt,
    nearly,
    missed,
    deckSlug,
    mode,
    finishFlashcardSession,
  ])

  if (cards.length === 0) {
    return (
      <AppShell>
        <div className="mx-auto flex max-w-lg flex-col gap-4">
          <p className="text-muted-foreground">
            No flashcards available for this selection yet. Try a starter deck
            or complete more lessons to unlock weak-area review.
          </p>
          <Button render={<Link href="/flashcards/session?deck=trading-basics" />}>
            Trading Basics deck
          </Button>
          <Button variant="ghost" render={<Link href="/flashcards" />}>
            Back to Flashcards
          </Button>
        </div>
      </AppShell>
    )
  }

  function handleCheckAnswer() {
    if (!card?.correctAnswer || !selectedOption) return
    setShowAnswer(true)
    setFlipped(true)
  }

  function inferConfidence(): FlashcardConfidence {
    if (!card?.correctAnswer || !selectedOption) return "nearly"
    return selectedOption === card.correctAnswer ? "got_it" : "missed"
  }

  if (finished) {
    const total = gotIt + nearly + missed
    const weakest =
      missedIds.length > 0
        ? cards.find((c) => c.id === missedIds[0])?.relatedConcept ??
          cards.find((c) => c.id === missedIds[0])?.tags[0] ??
          "Review missed cards"
        : "Keep practising"
    const streak = calculateDailyStreak(state)

    return (
      <AppShell>
        <div className="mx-auto flex max-w-lg flex-col gap-6">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
            <TrophyIcon className="size-10 text-primary" />
            <h1 className="text-2xl font-semibold">Session complete</h1>
            <p className="text-3xl font-bold text-primary">
              {gotIt}/{total}
            </p>
            <p className="text-sm text-muted-foreground">
              {gotIt} got it · {nearly} nearly · {missed} missed
            </p>
            <p className="text-xs text-muted-foreground">
              Weakest area: {weakest}
            </p>
            <p className="text-sm text-primary">+{xpEarned} XP earned</p>
            {streak > 0 && (
              <p className="text-xs text-muted-foreground">
                {streak}-day streak
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {missedIds.length > 0 && (
              <Button
                variant="outline"
                render={<Link href="/flashcards/session?mode=missed" />}
              >
                <RotateCcwIcon data-icon="inline-start" />
                Retry missed cards
              </Button>
            )}
            <Button render={<Link href="/paths/trading-foundations" />}>
              Continue learning
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button variant="ghost" render={<Link href="/flashcards" />}>
              Back to decks
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }

  const needsReveal =
    card?.type === "basic" ||
    card?.type === "scenario" ||
    card?.type === "chart" ||
    card?.type === "interactive-chart"
  const canRate =
    (card?.type === "multiple-choice" || card?.type === "true-false")
      ? showAnswer
      : needsReveal
        ? flipped || showAnswer
        : true

  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Card {index + 1} of {cards.length}
              {deck && ` · ${deck.title}`}
            </span>
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/flashcards" />}
            >
              Exit
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {card && (
          <FlashcardCardView
            card={card}
            flipped={flipped}
            onFlip={() => setFlipped(true)}
            selectedOption={selectedOption}
            onSelectOption={setSelectedOption}
            showAnswer={showAnswer}
          />
        )}

        <div className="flex flex-col gap-3">
          {(card?.type === "multiple-choice" || card?.type === "true-false") &&
            !showAnswer && (
              <Button
                onClick={handleCheckAnswer}
                disabled={!selectedOption}
                className="w-fit"
              >
                Check answer
              </Button>
            )}

          {canRate &&
            (card?.type === "multiple-choice" || card?.type === "true-false" ? (
              <Button
                className="w-fit"
                onClick={() => handleConfidence(inferConfidence())}
              >
                Continue
              </Button>
            ) : card?.type === "basic" ||
              card?.type === "scenario" ||
              card?.type === "chart" ||
              card?.type === "interactive-chart" ? (
              flipped || showAnswer ? (
                <ConfidenceButtons onSelect={handleConfidence} />
              ) : (
                <Button variant="outline" onClick={() => setFlipped(true)} className="w-fit">
                  Reveal answer
                </Button>
              )
            ) : (
              <ConfidenceButtons onSelect={handleConfidence} />
            ))}
        </div>
      </div>
    </AppShell>
  )
}
