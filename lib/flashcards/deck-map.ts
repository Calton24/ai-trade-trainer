const PATH_TO_DECK: Record<string, string> = {
  "trading-foundations": "trading-basics",
  "price-action": "market-structure",
  "forex-basics": "forex-basics",
  "icc-strategy": "icc",
  "risk-management": "risk-management",
  "trading-psychology": "psychology",
  "professional-forex": "professional-forex",
}

export function getDeckSlugForPath(pathSlug: string): string {
  return PATH_TO_DECK[pathSlug] ?? "trading-basics"
}

export function getFlashcardSessionHref(deckSlug?: string): string {
  if (deckSlug) {
    return `/flashcards/session?deck=${deckSlug}`
  }
  return "/flashcards/session?mode=game10"
}
