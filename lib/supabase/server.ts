import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./config"

export async function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
    )
  }

  const cookieStore = await cookies()

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        )
      },
    },
  })
}

export async function createClientIfConfigured() {
  if (!isSupabaseConfigured()) return null
  return createClient()
}
