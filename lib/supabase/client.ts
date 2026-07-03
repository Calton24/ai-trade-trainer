import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./config"

/**
 * Singleton browser client. Creating a new client on every call can deadlock
 * `auth.getUser()` / `onAuthStateChange` via navigator locks in production.
 */
let browserClient: SupabaseClient | null = null

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
    )
  }

  if (!browserClient) {
    browserClient = createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
  }
  return browserClient
}

export function createClientIfConfigured() {
  if (!isSupabaseConfigured()) return null
  return createClient()
}
