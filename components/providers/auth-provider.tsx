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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(null)
  const [enrollments, setEnrollments] = useState<string[]>([])
  // Start in a loading state until we resolve the session (Supabase or local),
  // so the route guard never bounces an authenticated user on first paint.
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (uid: string) => {
    const supabase = createClientIfConfigured()
    if (!supabase) return

    const [prof, enrolled] = await Promise.all([
      fetchUserProfile(supabase, uid),
      fetchEnrollments(supabase, uid),
    ])
    setProfile(prof)
    setEnrollments(enrolled)
  }, [])

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      const session = getLocalSession()
      setLocalProfile(session ? localAccountToProfile(session) : null)
      setLoading(false)
      return
    }

    const supabase = createClientIfConfigured()
    if (!supabase) {
      setLoading(false)
      return
    }

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()
    setUser(currentUser)
    if (currentUser) {
      await loadProfile(currentUser.id)
    } else {
      setProfile(null)
      setEnrollments([])
    }
    setLoading(false)
  }, [loadProfile])

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const session = getLocalSession()
      setLocalProfile(session ? localAccountToProfile(session) : null)
      setLoading(false)
      return
    }

    const supabase = createClientIfConfigured()
    if (!supabase) return

    refresh()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setProfile(null)
        setEnrollments([])
      }
    })

    return () => subscription.unsubscribe()
  }, [refresh, loadProfile])

  const signOutClient = useCallback(async () => {
    const supabase = createClientIfConfigured()
    if (supabase) await supabase.auth.signOut()
    clearLocalSession()
    setUser(null)
    setProfile(null)
    setLocalProfile(null)
    setEnrollments([])
  }, [])

  const signUpLocally = useCallback((input: LocalSignUpInput) => {
    const account = signUpLocal(input)
    setLocalProfile(localAccountToProfile(account))
  }, [])

  const signInLocally = useCallback((email: string) => {
    const account = signInLocal(email)
    setLocalProfile(localAccountToProfile(account))
  }, [])

  const value = useMemo(
    () => ({
      user,
      profile: configured ? profile : localProfile,
      enrollments,
      loading,
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
