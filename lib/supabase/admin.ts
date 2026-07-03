import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Node 20 has no native WebSocket. Server/admin code only uses Auth Admin +
 * PostgREST — never Realtime — so we pass a no-op transport.
 */
class NoopWebSocket {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSING = 2
  static CLOSED = 3
  readonly CONNECTING = 0
  readonly OPEN = 1
  readonly CLOSING = 2
  readonly CLOSED = 3
  readyState = NoopWebSocket.CLOSED
  bufferedAmount = 0
  extensions = ""
  protocol = ""
  url = ""
  binaryType: BinaryType = "blob"
  onclose = null
  onerror = null
  onmessage = null
  onopen = null
  close() {}
  send() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return false
  }
}

/**
 * Server-only admin client. Never import this from client components.
 * Used for privileged operations that bypass RLS (webhooks, admin jobs).
 */
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL are required for admin operations."
    )
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    realtime: { transport: NoopWebSocket },
  })
}

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}
