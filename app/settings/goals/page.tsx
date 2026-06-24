import type { Metadata } from "next"

import { GoalSettingsContent } from "@/components/habits/goal-settings-content"

export const metadata: Metadata = {
  title: "Goal Settings — TradeTrainer AI",
  description: "Set your weekly learning target and build consistent habits.",
}

export default function GoalSettingsPage() {
  return <GoalSettingsContent />
}
