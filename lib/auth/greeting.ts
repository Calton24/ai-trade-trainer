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

/** Muted glass-friendly tones — sit quietly on dark UI without neon accents. */
const AVATAR_PALETTE = [
  "bg-zinc-500/20 text-zinc-300 ring-zinc-400/25",
  "bg-zinc-600/25 text-zinc-200 ring-zinc-500/20",
  "bg-slate-500/20 text-slate-300 ring-slate-400/25",
  "bg-neutral-500/20 text-neutral-300 ring-neutral-400/25",
  "bg-stone-500/20 text-stone-300 ring-stone-400/25",
  "bg-zinc-700/30 text-zinc-300 ring-zinc-500/20",
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
