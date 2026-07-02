import type { OnboardingData, OnboardingStep } from "./types"

export const USERNAME_PATTERN = /^[a-z0-9_-]{3,24}$/

export const LEADERBOARD_USERNAME_REQUIRED =
  "LEADERBOARD_USERNAME_REQUIRED" as const

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "")
}

export function hasValidLeaderboardUsername(data: OnboardingData): boolean {
  const username = normalizeUsername(data.username)
  return Boolean(username && USERNAME_PATTERN.test(username))
}

export function needsLeaderboardUsernameFix(data: OnboardingData): boolean {
  return data.optInLeaderboard && !hasValidLeaderboardUsername(data)
}

function validateDisplayName(data: OnboardingData): string | null {
  if (!data.displayName.trim()) return "Display name is required."
  return null
}

function validateOptionalUsernameFormat(data: OnboardingData): string | null {
  const username = normalizeUsername(data.username)
  if (!username) return null
  if (!USERNAME_PATTERN.test(username)) {
    return "Username must be 3–24 characters: letters, numbers, underscore, or hyphen."
  }
  return null
}

export function validateLeaderboardUsername(
  data: OnboardingData
): string | null {
  if (!data.optInLeaderboard) return null
  const username = normalizeUsername(data.username)
  if (!username) return LEADERBOARD_USERNAME_REQUIRED
  if (!USERNAME_PATTERN.test(username)) {
    return "Username must be 3–24 characters: letters, numbers, underscore, or hyphen."
  }
  return null
}

export function validateStep(
  step: OnboardingStep,
  data: OnboardingData
): string | null {
  switch (step) {
    case 1: {
      const displayError = validateDisplayName(data)
      if (displayError) return displayError
      const leaderboardError = validateLeaderboardUsername(data)
      if (leaderboardError && leaderboardError !== LEADERBOARD_USERNAME_REQUIRED) {
        return leaderboardError
      }
      if (leaderboardError === LEADERBOARD_USERNAME_REQUIRED) {
        return "Choose a username to appear on public leaderboards, or turn this off for now."
      }
      return validateOptionalUsernameFormat(data)
    }
    case 2: {
      if (!data.experienceLevel) return "Select your experience level."
      return null
    }
    case 3: {
      if (!data.studyIntensity) return "Select a study intensity."
      if (!data.learningPlan) return "Select a learning plan."
      if (data.weeklyTargetDays < 1 || data.weeklyTargetDays > 7) {
        return "Weekly target must be between 1 and 7 days."
      }
      return null
    }
    case 4: {
      const displayError = validateDisplayName(data)
      if (displayError) return displayError
      const step2 = validateStep(2, data)
      if (step2) return step2
      const step3 = validateStep(3, data)
      if (step3) return step3
      const optionalUsername = validateOptionalUsernameFormat(data)
      if (optionalUsername) return optionalUsername
      const leaderboardError = validateLeaderboardUsername(data)
      if (leaderboardError === LEADERBOARD_USERNAME_REQUIRED) {
        return LEADERBOARD_USERNAME_REQUIRED
      }
      return leaderboardError
    }
    default:
      return null
  }
}

export function isLeaderboardUsernameRequiredError(
  message: string | null
): boolean {
  return message === LEADERBOARD_USERNAME_REQUIRED
}
