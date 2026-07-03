import { Resend } from "resend"

import { captureError, captureMessage } from "@/lib/observability/sentry"

/**
 * Transactional email scaffold. Disabled by default — `sendEmail` is safe
 * to call from anywhere; it never throws and never sends unless
 * `RESEND_API_KEY` is configured. See docs/observability.md for setup and
 * for which flows are (and aren't) wired to actually call this yet.
 */

let client: Resend | null = null

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  if (!client) client = new Resend(apiKey)
  return client
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

function getFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL || "TradeTrainer Academy <no-reply@tradetrainer.academy>"
  )
}

export interface SendEmailInput {
  to: string
  subject: string
  html: string
  /** Defaults to RESEND_FROM_EMAIL. */
  from?: string
}

export interface SendEmailResult {
  ok: boolean
  error?: string
}

/**
 * Safe email-send wrapper.
 * - No `RESEND_API_KEY`, development: logs the would-be email, doesn't send.
 * - No `RESEND_API_KEY`, production: no-ops and reports a Sentry warning
 *   (so a misconfigured deploy doesn't silently fail forever).
 * - Send failures are reported to Sentry and returned as `{ ok: false }`
 *   rather than thrown, so a broken email never breaks the calling flow.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const resend = getClient()
  const from = input.from ?? getFromAddress()

  if (!resend) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[email] RESEND_API_KEY not set — would have sent:", {
        to: input.to,
        subject: input.subject,
        from,
      })
      return { ok: true }
    }
    captureMessage(
      "Attempted to send an email with no RESEND_API_KEY configured.",
      "warning",
      { subject: input.subject }
    )
    return { ok: false, error: "Email is not configured." }
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    })

    if (error) {
      captureError(new Error(`Resend send failed: ${error.message}`), {
        subject: input.subject,
      })
      return { ok: false, error: error.message }
    }

    return { ok: true }
  } catch (error) {
    captureError(error, { subject: input.subject, context: "sendEmail" })
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to send email.",
    }
  }
}
