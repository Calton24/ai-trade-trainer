import { createClientIfConfigured } from "@/lib/supabase/client"
import { isSupabaseConfigured, SUPABASE_PROJECT_ID } from "@/lib/supabase/config"

export interface SupabaseHealthResult {
  configured: boolean
  projectId: string
  connected: boolean
  error?: string
}

/** Client-safe connectivity check (uses anon key only). */
export async function checkSupabaseHealth(): Promise<SupabaseHealthResult> {
  const projectId = SUPABASE_PROJECT_ID
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      projectId,
      connected: false,
      error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    }
  }

  const supabase = createClientIfConfigured()
  if (!supabase) {
    return {
      configured: false,
      projectId,
      connected: false,
      error: "Failed to create Supabase client",
    }
  }

  const { error } = await supabase.from("profiles").select("id").limit(1)
  if (error) {
    return {
      configured: true,
      projectId,
      connected: false,
      error: error.message,
    }
  }

  return { configured: true, projectId, connected: true }
}
