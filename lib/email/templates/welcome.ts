export interface WelcomeEmailProps {
  /** First name only — never pass full profile data into email templates. */
  name: string
}

export interface EmailContent {
  subject: string
  html: string
}

/**
 * Not wired to any live flow yet. When ready, call from the signup
 * completion path with `sendEmail({ to, ...welcomeEmail({ name }) })` — see
 * docs/observability.md.
 */
export function welcomeEmail({ name }: WelcomeEmailProps): EmailContent {
  const safeName = name.trim() || "there"

  return {
    subject: "Welcome to TradeTrainer Academy",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="font-size: 20px; margin-bottom: 8px;">Welcome, ${safeName} 👋</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #444;">
          Your TradeTrainer Academy account is ready. You've got access to
          guided lessons, chart drills, and progress tracking to help you
          build real trading skills.
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #444;">
          Jump back in whenever you're ready — your learning path is
          waiting for you.
        </p>
        <a
          href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://tradetrainer.academy"}/dashboard"
          style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 6px; font-size: 14px;"
        >
          Go to your dashboard
        </a>
      </div>
    `,
  }
}
