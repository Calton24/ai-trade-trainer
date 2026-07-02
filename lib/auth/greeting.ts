import type { UserProfile } from "@/lib/auth/types"

export type DayPeriod = "morning" | "afternoon" | "evening"

export interface TimeGreeting {
  period: DayPeriod
  emoji: string
  label: string
}

const WELCOME_BACK_KEY = "tradetrainer_daily_welcome"

/** Resolve a friendly display name — never the full email. */
export function getDisplayName(
  profile: UserProfile | null | undefined,
  email?: string | null
): string {
  const displayName = profile?.name?.trim()
  if (displayName) return displayName

  const emailPrefix = email?.split("@")[0]?.trim()
  if (emailPrefix) {
    const cleaned = emailPrefix.replace(/[._-]/g, " ")
    const titled = cleaned
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
    if (titled) return titled
  }

  return "Trader"
}

export function getDayPeriod(hour = new Date().getHours()): DayPeriod {
  if (hour < 12) return "morning"
  if (hour < 18) return "afternoon"
  return "evening"
}

export function getTimeGreeting(hour = new Date().getHours()): TimeGreeting {
  const period = getDayPeriod(hour)
  switch (period) {
    case "morning":
      return { period, emoji: "☀️", label: "Good Morning" }
    case "afternoon":
      return { period, emoji: "🌤️", label: "Good Afternoon" }
    case "evening":
      return { period, emoji: "🌙", label: "Good Evening" }
  }
}

export function formatGreeting(
  name: string,
  hour = new Date().getHours()
): string {
  const { label } = getTimeGreeting(hour)
  return `${label}, ${name}`
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0]?.[0] ?? "T").toUpperCase()
}

const AVATAR_PALETTE = [
  "bg-sky-500/25 text-sky-300 ring-sky-500/30",
  "bg-emerald-500/25 text-emerald-300 ring-emerald-500/30",
  "bg-violet-500/25 text-violet-300 ring-violet-500/30",
  "bg-amber-500/25 text-amber-300 ring-amber-500/30",
  "bg-rose-500/25 text-rose-300 ring-rose-500/30",
  "bg-cyan-500/25 text-cyan-300 ring-cyan-500/30",
] as const

export function getAvatarColorClass(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}

/** True the first time the profile menu is opened today (per device). */
export function consumeDailyWelcomeBack(): boolean {
  if (typeof window === "undefined") return false
  const today = new Date().toISOString().slice(0, 10)
  const last = localStorage.getItem(WELCOME_BACK_KEY)
  if (last === today) return false
  localStorage.setItem(WELCOME_BACK_KEY, today)
  return true
}
