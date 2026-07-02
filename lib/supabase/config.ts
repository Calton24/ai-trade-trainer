/** Supabase project ref for tradetrainer-ai */
export const SUPABASE_PROJECT_ID = "njsvozqbgirsikscaxbq"

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  `https://${SUPABASE_PROJECT_ID}.supabase.co`

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set")
  return url
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set")
  return key
}
