import type { Metadata } from "next"

import { TrendChallengePageClient } from "@/components/trend-spotter/trend-challenge-page-client"

export const metadata: Metadata = {
  title: "10-Chart Challenge — Trend Spotter",
  description: "Quick trend classification challenge with 10 generated charts.",
}

export default function TrendChallengePage() {
  return <TrendChallengePageClient />
}
