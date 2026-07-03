import {
  ALL_FLASHCARD_ARRAYS,
  DECK_SLUG_TO_CARDS,
  FLASHCARD_DECK_DEFS,
} from "@/content/flashcards/decks"
import type {
  Flashcard,
  FlashcardDeck,
  FlashcardProgress,
} from "@/lib/flashcards/types"

export const FLASHCARDS_DISCLAIMER =
  "TradeTrainer Academy is an educational simulator. Flashcards are for memory and practice only — not financial advice, signals, or profit guarantees."

const ALL_CARDS = ALL_FLASHCARD_ARRAYS.flat()
const CARD_MAP = new Map(ALL_CARDS.map((c) => [c.id, c]))
const DECK_MAP = new Map<string, FlashcardDeck>()

export const FLASHCARD_DECKS: FlashcardDeck[] = FLASHCARD_DECK_DEFS.map(
  (def) => {
    const cards = DECK_SLUG_TO_CARDS[def.slug] ?? []
    const deck: FlashcardDeck = {
      ...def,
      cardIds: cards.map((c) => c.id),
    }
    DECK_MAP.set(def.slug, deck)
    DECK_MAP.set(def.id, deck)
    return deck
  }
)

export function getAllFlashcardDecks(): FlashcardDeck[] {
  return FLASHCARD_DECK_DEFS.map((def) => DECK_MAP.get(def.slug)!)
}

export function getFlashcardDeck(slugOrId: string): FlashcardDeck | undefined {
  return DECK_MAP.get(slugOrId)
}

export function getAllFlashcards(): Flashcard[] {
  return ALL_CARDS
}

export function getFlashcardById(id: string): Flashcard | undefined {
  return CARD_MAP.get(id)
}

export function getDeckFlashcards(deckId: string): Flashcard[] {
  const deck = getFlashcardDeck(deckId)
  if (!deck) return []
  return deck.cardIds
    .map((id) => CARD_MAP.get(id))
    .filter((c): c is Flashcard => c !== undefined)
}

export function getDueFlashcards(
  progress: Record<string, FlashcardProgress>,
  now = new Date()
): Flashcard[] {
  const nowIso = now.toISOString()
  return ALL_CARDS.filter((card) => {
    const p = progress[card.id]
    if (!p) return false
    if (p.mastered) return false
    if (!p.nextReviewAt) return true
    return p.nextReviewAt <= nowIso
  })
}

export function getWeakFlashcards(
  progress: Record<string, FlashcardProgress>
): Flashcard[] {
  return ALL_CARDS.filter((card) => {
    const p = progress[card.id]
    return p && (p.confidence === "missed" || p.confidence === "nearly")
  })
}

export function getMissedFlashcards(
  progress: Record<string, FlashcardProgress>
): Flashcard[] {
  return ALL_CARDS.filter((card) => {
    const p = progress[card.id]
    return p?.confidence === "missed"
  })
}

export function getMixedReviewDeck(
  progress: Record<string, FlashcardProgress>,
  count = 10
): Flashcard[] {
  const due = getDueFlashcards(progress)
  const weak = getWeakFlashcards(progress).filter(
    (c) => !due.some((d) => d.id === c.id)
  )
  const unseen = ALL_CARDS.filter((c) => !progress[c.id])
  const pool = [...due, ...weak, ...unseen]
  if (pool.length === 0) {
    return shuffle([...ALL_CARDS]).slice(0, count)
  }
  return shuffle(pool).slice(0, count)
}

export function buildSessionDeck(
  mode: string,
  deckSlug: string | null,
  progress: Record<string, FlashcardProgress>,
  count = 10
): Flashcard[] {
  switch (mode) {
    case "weak":
      return shuffle(getWeakFlashcards(progress)).slice(0, count)
    case "missed":
      return shuffle(getMissedFlashcards(progress)).slice(0, count)
    case "due":
      return shuffle(getDueFlashcards(progress)).slice(0, count)
    case "mixed":
      return getMixedReviewDeck(progress, count)
    case "chart":
      return shuffle(getDeckFlashcards("chart-cards")).slice(0, count)
    case "icc":
      return shuffle(getDeckFlashcards("icc")).slice(0, count)
    case "risk":
      return shuffle(getDeckFlashcards("risk-management")).slice(0, count)
    case "book-lab":
      return shuffle(getDeckFlashcards("book-lab")).slice(0, count)
    default:
      if (deckSlug) {
        const deckCards = getDeckFlashcards(deckSlug)
        if (deckCards.length > 0) {
          return shuffle(deckCards).slice(0, count)
        }
      }
      return getMixedReviewDeck(progress, count)
  }
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export {
  getDueFlashcards as getDueFlashcardsFromRegistry,
  getWeakFlashcards as getWeakFlashcardsFromRegistry,
}
