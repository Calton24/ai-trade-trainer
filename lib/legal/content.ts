export interface LegalSection {
  id: string
  title: string
  body: string[]
}

export const EDUCATIONAL_DISCLAIMER = [
  "TradeTrainer Academy is an educational platform only.",
  "It does not provide financial advice, investment recommendations, or trading signals.",
  "It does not guarantee profits or trading outcomes of any kind.",
  "Simulated results do not represent actual trading performance.",
  "Users are solely responsible for their own trading decisions and any capital they choose to risk.",
]

export const LEGAL_DOCUMENTS: Record<string, LegalSection[]> = {
  terms: [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      body: [
        "By creating an account or using TradeTrainer Academy, you agree to these Terms of Use.",
        "If you do not agree, do not use the platform.",
      ],
    },
    {
      id: "educational",
      title: "Educational Purpose Only",
      body: EDUCATIONAL_DISCLAIMER,
    },
    {
      id: "accounts",
      title: "Accounts",
      body: [
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You must provide accurate profile information and keep it up to date.",
      ],
    },
    {
      id: "content",
      title: "Platform Content",
      body: [
        "Lessons, quizzes, simulations, and assessments are provided for learning purposes.",
        "Content may be updated, expanded, or removed as the programme evolves.",
      ],
    },
  ],
  privacy: [
    {
      id: "collection",
      title: "Information We Collect",
      body: [
        "Account information such as email, display name, and profile preferences.",
        "Learning progress, quiz scores, competency metrics, and activity logs.",
        "Privacy and notification preferences you configure in settings.",
      ],
    },
    {
      id: "usage",
      title: "How We Use Information",
      body: [
        "To personalise your learning experience and track progression.",
        "To power leaderboards only when you opt in and choose a public username.",
        "Your email address is never displayed publicly on leaderboards.",
      ],
    },
    {
      id: "controls",
      title: "Your Controls",
      body: [
        "You can export or reset your learning progress from Settings.",
        "You can request account deletion from the Danger Zone.",
        "You can manage leaderboard visibility and public profile fields in Privacy settings.",
      ],
    },
  ],
  risk: [
    {
      id: "risk",
      title: "Trading Risk Disclaimer",
      body: [
        "Trading financial markets involves substantial risk of loss.",
        "Most retail traders lose money. Past performance — simulated or real — does not guarantee future results.",
        "TradeTrainer Academy does not execute live trades and is not a broker or financial adviser.",
        ...EDUCATIONAL_DISCLAIMER,
      ],
    },
  ],
  refund: [
    {
      id: "overview",
      title: "Overview",
      body: [
        "This Refund / Cancellation Policy explains how paid TradeTrainer Academy subscriptions can be cancelled and when refunds may apply.",
        "TradeTrainer Academy is an educational digital product. Access is delivered immediately after a successful subscription payment or an approved beta grant.",
      ],
    },
    {
      id: "cancellation",
      title: "Cancellation",
      body: [
        "You may cancel a paid subscription at any time from Settings → Billing using Manage subscription (Stripe Customer Portal), or by contacting support with the email on your account.",
        "Cancellation stops future renewals. You keep Pro access until the end of the current paid billing period.",
        "Admin-granted beta access may be revoked by TradeTrainer Academy at any time and expires automatically on the grant end date.",
      ],
    },
    {
      id: "refunds",
      title: "Refunds",
      body: [
        "Because digital access is provided immediately, subscription fees are generally non-refundable once the billing period has started.",
        "If you believe you were charged in error, contact support within 7 days of the charge with your account email and payment details.",
        "We may issue a refund at our discretion for duplicate charges, confirmed billing errors, or other exceptional circumstances.",
        "Refunds, when approved, are returned to the original payment method and may take several business days to appear.",
      ],
    },
    {
      id: "trials-and-beta",
      title: "Trials and private beta",
      body: [
        "Private beta access granted without payment does not create a refund entitlement.",
        "If a free trial is offered in the future, trial terms will be shown at checkout and will control over this policy where they conflict.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: [
        "For cancellation or refund requests, contact support with the email address on your TradeTrainer Academy account.",
        "We aim to respond to billing requests within a reasonable time during business days.",
      ],
    },
  ],
}
