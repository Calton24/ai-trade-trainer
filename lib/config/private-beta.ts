/**
 * Private beta: hide checkout and de-emphasise pricing while testers use
 * admin_grants for Pro access.
 *
 * Set in Vercel Production during the 5-tester cohort:
 *   NEXT_PUBLIC_PRIVATE_BETA=true
 *
 * Remove or set to false when opening public checkout.
 */
export function isPrivateBetaEnabled(): boolean {
  return process.env.NEXT_PUBLIC_PRIVATE_BETA === "true"
}

export const PRIVATE_BETA_MESSAGE =
  "TradeTrainer Academy is in private beta. Pro access is invite-only — sign up free and we'll enable your account."
