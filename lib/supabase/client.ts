/**
 * Supabase browser client — wire up when NEXT_PUBLIC_SUPABASE_URL and
 * NEXT_PUBLIC_SUPABASE_ANON_KEY are configured.
 *
 * Install: npm install @supabase/supabase-js @supabase/ssr
 *
 * import { createBrowserClient } from "@supabase/ssr"
 *
 * export function createClient() {
 *   return createBrowserClient(
 *     process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 *   )
 * }
 */

export function createClient() {
  throw new Error(
    "Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
  )
}
