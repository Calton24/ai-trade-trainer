import { type NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/middleware"

/**
 * Root server-side gate for the whole app (Next.js 16 renamed
 * `middleware.ts` -> `proxy.ts` / `export function proxy` — same
 * request-interception behaviour, see AGENTS.md).
 *
 * This is the source of truth for auth + Pro-subscription access control.
 * See `lib/supabase/middleware.ts` for the route matrix and redirect rules.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
