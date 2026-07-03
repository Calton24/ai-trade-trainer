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
      id: "refund",
      title: "Refund Policy",
      body: [
        "Subscription refunds are handled according to the billing provider's policy at the time of purchase.",
        "Contact support with your account email if you believe a charge was made in error.",
        "This is a placeholder policy until Stripe billing is fully configured.",
      ],
    },
  ],
}
