import type { OnboardingData, OnboardingDraftEnvelope, OnboardingStep } from "./types"

const KEY_PREFIX = "tradetrainer_onboarding_draft_"

function draftKey(userId: string): string {
  return `${KEY_PREFIX}${userId}`
}

export function loadOnboardingDraft(
  userId: string
): OnboardingDraftEnvelope | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(draftKey(userId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as OnboardingDraftEnvelope
    if (parsed.userId !== userId) return null
    return parsed
  } catch {
    return null
  }
}

export function saveOnboardingDraft(
  userId: string,
  data: OnboardingData,
  step: OnboardingStep
): void {
  if (typeof window === "undefined") return
  const envelope: OnboardingDraftEnvelope = {
    userId,
    data,
    step,
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem(draftKey(userId), JSON.stringify(envelope))
}

export function clearOnboardingDraft(userId: string): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(draftKey(userId))
}

/** Remove drafts belonging to other users (same browser, different account). */
export function clearStaleOnboardingDrafts(activeUserId: string): void {
  if (typeof window === "undefined") return
  for (let i = localStorage.length - 1; i >= 0; i -= 1) {
    const key = localStorage.key(i)
    if (!key?.startsWith(KEY_PREFIX)) continue
    if (key !== draftKey(activeUserId)) {
      localStorage.removeItem(key)
    }
  }
}

export function mergeOnboardingSources(
  remote: OnboardingData,
  remoteStep: OnboardingStep,
  remoteUpdatedAt: string | null,
  draft: OnboardingDraftEnvelope | null
): { data: OnboardingData; step: OnboardingStep } {
  if (!draft) {
    return { data: remote, step: remoteStep }
  }

  const remoteTime = remoteUpdatedAt ? Date.parse(remoteUpdatedAt) : 0
  const draftTime = Date.parse(draft.savedAt)

  if (draftTime > remoteTime) {
    return { data: { ...remote, ...draft.data }, step: draft.step }
  }

  return { data: remote, step: remoteStep }
}
