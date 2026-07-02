import { createBrowserClient } from "@supabase/ssr"

import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./config"

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
    )
  }

  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
}

export function createClientIfConfigured() {
  if (!isSupabaseConfigured()) return null
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
}
