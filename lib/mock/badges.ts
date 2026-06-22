import type { Badge } from "@/lib/types"

/** Badge definitions only — earned state comes from user localStorage */
export const badgeDefinitions: Omit<Badge, "earned" | "earnedAt">[] = [
  {
    id: "first-drill",
    name: "First Drill",
    description: "Completed your first chart drill",
    icon: "🎯",
  },
  {
    id: "support-spotter",
    name: "Support Spotter",
    description: "Correctly identified support in a drill",
    icon: "📍",
  },
  {
    id: "risk-manager",
    name: "Risk Manager",
    description: "Planned stop loss and take profit in 3 full setup drills",
    icon: "🛡️",
  },
  {
    id: "break-retest-beginner",
    name: "Break & Retest Beginner",
    description: "Completed the Break & Retest lesson",
    icon: "📈",
  },
  {
    id: "seven-day-streak",
    name: "7-Day Streak",
    description: "Practiced 7 days in a row",
    icon: "🔥",
  },
]

export function getBadgeById(id: string) {
  return badgeDefinitions.find((b) => b.id === id)
}
