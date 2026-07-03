/**
 * Shared helpers for local admin scripts (grant beta, referral reports, etc.).
 * Never import from client components.
 */

import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import { createClient } from "@supabase/supabase-js"

function loadDotEnvLocal() {
  const path = resolve(process.cwd(), ".env.local")
  if (!existsSync(path)) return
  const content = readFileSync(path, "utf8")
  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const idx = trimmed.indexOf("=")
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    let val = trimmed.slice(idx + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

loadDotEnvLocal()

export function loadEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
    )
    console.error("Load .env.local first, e.g.: export $(grep -v '^#' .env.local | xargs)")
    process.exit(1)
  }

  return { url, serviceKey }
}

/**
 * Node 20 has no native WebSocket. Admin scripts only use Auth Admin + REST
 * (PostgREST) — never Realtime — so we pass a no-op transport and avoid
 * installing `ws` or requiring Node 22+.
 */
class NoopWebSocket {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSING = 2
  static CLOSED = 3
  readyState = NoopWebSocket.CLOSED
  bufferedAmount = 0
  extensions = ""
  protocol = ""
  url = ""
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

export function createScriptAdmin() {
  const { url, serviceKey } = loadEnv()
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    realtime: {
      transport: NoopWebSocket,
    },
  })
}

export function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token.startsWith("--")) {
      const key = token.slice(2)
      const next = argv[i + 1]
      if (next && !next.startsWith("--")) {
        args[key] = next
        i += 1
      } else {
        args[key] = true
      }
    }
  }
  return args
}

export async function findUserIdByEmail(admin, email) {
  const normalized = email.trim().toLowerCase()

  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .ilike("email", normalized)
    .maybeSingle()

  if (profile?.id) return profile.id

  let page = 1
  const perPage = 200

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) throw error

    const match = data.users.find(
      (u) => u.email?.toLowerCase() === normalized
    )
    if (match) return match.id

    if (data.users.length < perPage) break
    page += 1
  }

  return null
}
