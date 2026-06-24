import type { Metadata } from "next"

import { TrendSessionResults } from "@/components/trend-spotter/trend-session-results"

interface PageProps {
  params: Promise<{ sessionId: string }>
}

export const metadata: Metadata = {
  title: "Trend Session Results",
}

export default async function TrendSessionResultsPage({ params }: PageProps) {
  const { sessionId } = await params
  return <TrendSessionResults sessionId={sessionId} />
}
