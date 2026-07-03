import type { EmailContent } from "./welcome"

export interface PaymentFailedEmailProps {
  name?: string
  /** Never pass raw card/payment details — only a high-level plan label. */
  planLabel?: string
}

/**
 * Not wired to any live flow yet. When ready, call from the Stripe webhook
 * on `invoice.payment_failed` with
 * `sendEmail({ to, ...paymentFailedEmail({ name, planLabel }) })` — see
 * docs/observability.md.
 */
export function paymentFailedEmail({
  name,
  planLabel,
}: PaymentFailedEmailProps = {}): EmailContent {
  const greeting = name?.trim() ? `Hi ${name.trim()},` : "Hi,"
  const plan = planLabel ? ` for your ${planLabel} plan` : ""

  return {
    subject: "Action needed: your payment didn't go through",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="font-size: 20px; margin-bottom: 8px;">Payment failed</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #444;">
          ${greeting} we weren't able to process your latest payment${plan}.
          Your access may be paused until this is resolved.
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #444;">
          Please update your billing details to keep your subscription
          active.
        </p>
        <a
          href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://tradetrainer.academy"}/settings/billing"
          style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 6px; font-size: 14px;"
        >
          Update billing details
        </a>
      </div>
    `,
  }
}
