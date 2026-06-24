import { DECK_UNLOCK_RULES } from "@/content/flashcards/deck-gates"
import { NODE_BY_ID } from "@/content/learning-map/nodes"
import type { AccessLevel, LockInfo } from "@/lib/learning-map/types"
import { isNodeComplete } from "@/lib/learning-map/unlocks"
import type { UserState } from "@/lib/user-state/types"

export function getFlashcardDeckAccess(
  state: UserState,
  deckSlug: string
): AccessLevel {
  const rule = DECK_UNLOCK_RULES[deckSlug]
  if (!rule || rule.requiredNodeIds.length === 0) return "unlocked"
  if (rule.requiredNodeIds.every((id) => isNodeComplete(state, id))) {
    return "unlocked"
  }
  const someMet = rule.requiredNodeIds.some((id) => isNodeComplete(state, id))
  return someMet ? "preview" : "locked"
}

export function getFlashcardDeckLockInfo(
  state: UserState,
  deckSlug: string
): LockInfo {
  const access = getFlashcardDeckAccess(state, deckSlug)
  const rule = DECK_UNLOCK_RULES[deckSlug]
  if (access === "unlocked" || !rule) {
    return { accessLevel: "unlocked", reason: "", missingPrerequisites: [] }
  }

  const missingPrerequisites = rule.requiredNodeIds
    .filter((id) => !isNodeComplete(state, id))
    .map((id) => {
      const node = NODE_BY_ID[id]
      return {
        id,
        title: node?.title ?? id,
        href: node?.href ?? "/learning-map",
      }
    })

  const firstMissing = missingPrerequisites[0]
  return {
    accessLevel: access,
    reason: rule.lockedMessage,
    missingPrerequisites,
    ctaHref: firstMissing?.href ?? "/learning-map",
  }
}
