/**
 * Central access control map.
 *
 * Unauthenticated visitors may only reach marketing/auth pages. Everything
 * educational is protected and redirects to sign-in (with a return URL).
 */

/** Paths (and their subtrees) reachable without authentication. */
export const PUBLIC_PREFIXES = [
  "/pricing",
  "/features",
  "/about",
  "/faq",
  "/roadmap",
  "/testimonials",
  "/terms",
  "/privacy",
  "/risk-disclaimer",
  "/sign-in",
  "/sign-up",
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/auth",
  "/api",
] as const

const AUTH_ENTRY_PATHS = new Set([
  "/sign-in",
  "/sign-up",
  "/signin",
  "/signup",
])

export function isAuthEntryPath(pathname: string): boolean {
  return AUTH_ENTRY_PATHS.has(pathname)
}

/** Exact public paths (no subtree). */
const PUBLIC_EXACT = new Set<string>(["/"])

export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function isProtectedPath(pathname: string): boolean {
  return !isPublicPath(pathname)
}

/** Build a sign-in URL that returns the user to where they were headed. */
export function signInWithReturn(pathname: string): string {
  if (!pathname || pathname === "/sign-in") return "/sign-in"
  return `/sign-in?redirect=${encodeURIComponent(pathname)}`
}

export function signUpWithReturn(pathname: string): string {
  if (!pathname) return "/sign-up"
  return `/sign-up?redirect=${encodeURIComponent(pathname)}`
}
