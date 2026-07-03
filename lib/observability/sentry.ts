import * as Sentry from "@sentry/nextjs"

/**
 * Production error-monitoring scaffold. Fully optional and disabled by
 * default — every function here is a safe no-op unless a DSN is present in
 * the environment. Never throws, never blocks a request, never requires an
 * account to exist for local development or CI.
 *
 * Server code reads `SENTRY_DSN` (falling back to the public one so a
 * single DSN works if that's all that's configured). Client/browser code
 * only ever reads `NEXT_PUBLIC_SENTRY_DSN` (the server secret is never
 * bundled into client JS).
 *
 * See docs/observability.md for setup steps and what/what not to send.
 */

let initialized = false

function getDsn(): string | undefined {
  if (typeof window === "undefined") {
    return process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || undefined
  }
  return process.env.NEXT_PUBLIC_SENTRY_DSN || undefined
}

export function isSentryEnabled(): boolean {
  return Boolean(getDsn())
}

/** Idempotent — safe to call from every entry point (instrumentation files, this module's own helpers). */
export function initSentry(): void {
  if (initialized) return
  const dsn = getDsn()
  if (!dsn) return

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    // Conservative default — trace volume can be tuned once real traffic
    // and a Sentry plan are in place.
    tracesSampleRate: 0.1,
    // Never send raw request/response bodies by default — see
    // docs/observability.md ("what not to track"). PII should always be
    // scrubbed at the call site via `context`, not relied on here.
    sendDefaultPii: false,
  })
  initialized = true
}

export type SentryContext = Record<string, unknown>
export type SentryLevel = "debug" | "info" | "warning" | "error" | "fatal"

/**
 * Reports an error. No-ops safely (with a dev-only console.error for local
 * visibility) if no DSN is configured — never throws, so it's always safe
 * to call from a catch block.
 */
export function captureError(error: unknown, context?: SentryContext): void {
  if (!isSentryEnabled()) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[observability] captureError (Sentry disabled):", error, context)
    }
    return
  }

  try {
    initSentry()
    Sentry.captureException(error, context ? { extra: context } : undefined)
  } catch (sentryError) {
    console.error("[observability] failed to report error to Sentry:", sentryError)
  }
}

/** Reports a non-error event (e.g. a degraded/misconfigured state worth knowing about). */
export function captureMessage(
  message: string,
  level: SentryLevel = "info",
  context?: SentryContext
): void {
  if (!isSentryEnabled()) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[observability] captureMessage (Sentry disabled) [${level}]:`, message, context)
    }
    return
  }

  try {
    initSentry()
    Sentry.captureMessage(message, { level, extra: context })
  } catch (sentryError) {
    console.error("[observability] failed to report message to Sentry:", sentryError)
  }
}
