import type { Metadata } from "next"

import { LeaderboardContent } from "@/components/leaderboard/leaderboard-content"

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Daily, weekly, monthly, and all-time XP leaderboards. Compete with traders worldwide.",
}

export default function LeaderboardPage() {
  return <LeaderboardContent />
}
