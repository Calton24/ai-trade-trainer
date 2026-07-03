"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { User } from "@supabase/supabase-js"

import type { UserProfile } from "@/lib/auth/types"
import {
  clearLocalSession,
  getLocalSession,
  localAccountToProfile,
  signInLocal,
  signUpLocal,
  type LocalSignUpInput,
} from "@/lib/auth/local-session"
import { createClientIfConfigured } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { clearSettingsStorage } from "@/lib/settings/storage"
import {
  fetchEnrollments,
  fetchLearningState,
  fetchUserProfile,
} from "@/lib/supabase/sync"

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  enrollments: string[]
  loading: boolean
  /** True once the initial session + profile attempt has finished (success or fail). */
  profileReady: boolean
  isConfigured: boolean
  /** True when authenticated via Supabase OR the local-account fallback. */
  isAuthenticated: boolean
  authMode: "supabase" | "local"
  refresh: () => Promise<void>
  signOutClient: () => Promise<void>
  /** Local-account fallback (used when Supabase isn't configured). */
  signUpLocally: (input: LocalSignUpInput) => void
  signInLocally: (email: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const AUTH_TIMEOUT_MS = 12_000

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`))
    }, ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      }
    )
  })
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(null)
  const [enrollments, setEnrollments] = useState<string[]>([])
  // Start in a loading state until we resolve the session (Supabase or local),
  // so the route guard never bounces an authenticated user on first paint.
  const [loading, setLoading] = useState(true)
  const [profileReady, setProfileReady] = useState(false)

  const loadProfile = useCallback(async (uid: string) => {
    const supabase = createClientIfConfigured()
    if (!supabase) {
      setProfile(null)
      setEnrollments([])
      setProfileReady(true)
      return
    }

    try {
      const [prof, enrolled] = await withTimeout(
        Promise.all([
          fetchUserProfile(supabase, uid),
          fetchEnrollments(supabase, uid),
        ]),
        AUTH_TIMEOUT_MS,
        "profile load"
      )
      setProfile(prof)
      setEnrollments(enrolled)
    } catch (error) {
      console.error("[auth] profile load failed", error)
      setProfile(null)
      setEnrollments([])
    } finally {
      setProfileReady(true)
    }
  }, [])

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      const session = getLocalSession()
      setLocalProfile(session ? localAccountToProfile(session) : null)
      setProfileReady(true)
      setLoading(false)
      return
    }

    const supabase = createClientIfConfigured()
    if (!supabase) {
      setProfileReady(true)
      setLoading(false)
      return
    }

    try {
      const {
        data: { user: currentUser },
      } = await withTimeout(supabase.auth.getUser(), AUTH_TIMEOUT_MS, "auth.getUser")
      setUser(currentUser)
      if (currentUser) {
        await loadProfile(currentUser.id)
      } else {
        setProfile(null)
        setEnrollments([])
        setProfileReady(true)
      }
    } catch (error) {
      console.error("[auth] session refresh failed", error)
      setUser(null)
      setProfile(null)
      setEnrollments([])
      setProfileReady(true)
    } finally {
      setLoading(false)
    }
  }, [loadProfile])

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const session = getLocalSession()
      setLocalProfile(session ? localAccountToProfile(session) : null)
      setProfileReady(true)
      setLoading(false)
      return
    }

    const supabase = createClientIfConfigured()
    if (!supabase) {
      setProfileReady(true)
      setLoading(false)
      return
    }

    void refresh()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        clearSettingsStorage()
        void loadProfile(session.user.id)
      } else {
        clearSettingsStorage()
        setProfile(null)
        setEnrollments([])
        setProfileReady(true)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [refresh, loadProfile])

  const signOutClient = useCallback(async () => {
    const supabase = createClientIfConfigured()
    if (supabase) await supabase.auth.signOut()
    clearLocalSession()
    clearSettingsStorage()
    setUser(null)
    setProfile(null)
    setLocalProfile(null)
    setEnrollments([])
    setProfileReady(true)
    setLoading(false)
  }, [])

  const signUpLocally = useCallback((input: LocalSignUpInput) => {
    const account = signUpLocal(input)
    setLocalProfile(localAccountToProfile(account))
    setProfileReady(true)
    setLoading(false)
  }, [])

  const signInLocally = useCallback((email: string) => {
    const account = signInLocal(email)
    setLocalProfile(localAccountToProfile(account))
    setProfileReady(true)
    setLoading(false)
  }, [])

  const value = useMemo(
    () => ({
      user,
      profile: configured ? profile : localProfile,
      enrollments,
      loading,
      profileReady,
      isConfigured: configured,
      isAuthenticated: configured ? Boolean(user) : Boolean(localProfile),
      authMode: configured ? ("supabase" as const) : ("local" as const),
      refresh,
      signOutClient,
      signUpLocally,
      signInLocally,
    }),
    [
      user,
      profile,
      localProfile,
      enrollments,
      loading,
      profileReady,
      configured,
      refresh,
      signOutClient,
      signUpLocally,
      signInLocally,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}

export async function loadCloudLearningState(userId: string) {
  const supabase = createClientIfConfigured()
  if (!supabase) return null
  return fetchLearningState(supabase, userId)
}
