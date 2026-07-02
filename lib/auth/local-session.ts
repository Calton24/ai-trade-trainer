import type { TradingExperience, UserProfile } from "./types"

/**
 * Local-account fallback.
 *
 * When Supabase isn't configured, learners still must "create an account" to
 * unlock content — the session simply lives on the device. The shape mirrors a
 * Supabase-backed profile so the rest of the app is identical, and it upgrades
 * seamlessly to real cloud auth once credentials are added.
 */

export interface LocalAccount {
  id: string
  name: string
  email: string
  country: string | null
  tradingExperience: TradingExperience | null
  createdAt: string
}

const SESSION_KEY = "tradetrainer_local_session"
const ACCOUNTS_KEY = "tradetrainer_local_accounts"

function readAccounts(): Record<string, LocalAccount> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    return raw ? (JSON.parse(raw) as Record<string, LocalAccount>) : {}
  } catch {
    return {}
  }
}

function writeAccounts(accounts: Record<string, LocalAccount>) {
  if (typeof window === "undefined") return
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export function getLocalSession(): LocalAccount | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as LocalAccount) : null
  } catch {
    return null
  }
}

function setLocalSession(account: LocalAccount) {
  if (typeof window === "undefined") return
  localStorage.setItem(SESSION_KEY, JSON.stringify(account))
}

export function clearLocalSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(SESSION_KEY)
}

export interface LocalSignUpInput {
  name: string
  email: string
  country?: string | null
  tradingExperience?: TradingExperience | null
}

export function signUpLocal(input: LocalSignUpInput): LocalAccount {
  const accounts = readAccounts()
  const key = input.email.trim().toLowerCase()

  const account: LocalAccount =
    accounts[key] ?? {
      id: `local-${crypto.randomUUID()}`,
      name: input.name.trim() || "Trader",
      email: input.email.trim(),
      country: input.country ?? null,
      tradingExperience: input.tradingExperience ?? null,
      createdAt: new Date().toISOString(),
    }

  // Refresh editable fields on re-signup.
  account.name = input.name.trim() || account.name
  account.country = input.country ?? account.country
  account.tradingExperience = input.tradingExperience ?? account.tradingExperience

  accounts[key] = account
  writeAccounts(accounts)
  setLocalSession(account)
  return account
}

export function signInLocal(email: string): LocalAccount {
  const accounts = readAccounts()
  const key = email.trim().toLowerCase()
  const existing = accounts[key]
  if (existing) {
    setLocalSession(existing)
    return existing
  }
  // First-time sign-in with no prior account: create one on the fly.
  return signUpLocal({ name: email.split("@")[0] ?? "Trader", email })
}

export function updateLocalProfile(
  patch: Partial<Pick<LocalAccount, "name" | "country" | "tradingExperience">>
): LocalAccount | null {
  const session = getLocalSession()
  if (!session) return null
  const accounts = readAccounts()
  const key = session.email.trim().toLowerCase()
  const updated: LocalAccount = {
    ...session,
    ...patch,
    name: patch.name?.trim() || session.name,
  }
  accounts[key] = updated
  writeAccounts(accounts)
  setLocalSession(updated)
  return updated
}

export function deleteLocalAccount(): void {
  const session = getLocalSession()
  if (!session) return
  const accounts = readAccounts()
  delete accounts[session.email.trim().toLowerCase()]
  writeAccounts(accounts)
  clearLocalSession()
}

/** Map a local account onto the shared UserProfile shape. */
export function localAccountToProfile(account: LocalAccount): UserProfile {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    avatarUrl: null,
    tradingExperience: account.tradingExperience,
    createdAt: account.createdAt,
    currentLevel: 1,
    totalXP: 0,
    streakDays: 0,
    weeklyTarget: null,
    lessonsCompleted: 0,
    quizzesCompleted: 0,
    drillsCompleted: 0,
    strongestSkill: null,
    weakestSkill: null,
  }
}
