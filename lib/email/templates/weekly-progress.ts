import type { EmailContent } from "./welcome"

export interface WeeklyProgressEmailProps {
  name?: string
  /** Aggregate counts only — never journal text, trade notes, or chart images. */
  lessonsCompleted: number
  xpEarned: number
  currentStreak: number
}

/**
 * Not wired to any live flow yet (no scheduler/cron exists for this). When
 * ready, call from a scheduled job with
 * `sendEmail({ to, ...weeklyProgressEmail({ ... }) })` — see
 * docs/observability.md. Only ever pass aggregate numbers, never free-text
 * user content.
 */
export function weeklyProgressEmail({
  name,
  lessonsCompleted,
  xpEarned,
  currentStreak,
}: WeeklyProgressEmailProps): EmailContent {
  const greeting = name?.trim() ? `Hi ${name.trim()},` : "Hi,"

  return {
    subject: "Your week in TradeTrainer Academy",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="font-size: 20px; margin-bottom: 8px;">Your weekly progress</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #444;">${greeting} here's what you did this week:</p>
        <ul style="font-size: 14px; line-height: 1.8; color: #444; padding-left: 20px;">
          <li>${lessonsCompleted} lesson${lessonsCompleted === 1 ? "" : "s"} completed</li>
          <li>${xpEarned} XP earned</li>
          <li>${currentStreak}-day current streak</li>
        </ul>
        <a
          href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://tradetrainer.academy"}/dashboard"
          style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 6px; font-size: 14px;"
        >
          Keep the streak going
        </a>
      </div>
    `,
  }
}
