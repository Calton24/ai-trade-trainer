import type { Metadata } from "next"

import { ReadinessResults } from "@/components/trader-readiness/readiness-results"

export const metadata: Metadata = {
  title: "Assessment Results",
  description: "Your Trader Readiness assessment results and personalised roadmap.",
}

export default async function TraderReadinessResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params
  return <ReadinessResults sessionId={sessionId} />
}
