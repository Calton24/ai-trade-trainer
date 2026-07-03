import type { Metadata } from "next"

import { CommunityContent } from "@/components/community/community-content"

export const metadata: Metadata = {
  title: "Community — TradeTrainer Academy",
}

export default function CommunityPage() {
  return <CommunityContent />
}
