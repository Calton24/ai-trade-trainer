import type { Metadata } from "next"

import { TrendSpotterContent } from "@/components/trend-spotter/trend-spotter-content"

export const metadata: Metadata = {
  title: "Trend Spotter — TradeTrainer Academy",
  description:
    "Train your eye to identify uptrends, downtrends, ranges, and messy charts.",
}

export default function TrendSpotterPage() {
  return <TrendSpotterContent />
}
