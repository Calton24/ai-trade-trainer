/** Trader Development Roadmap — game-style progression titles. */
export const TRADER_ROADMAP = [
  { level: 1, title: "Market Explorer", minXp: 0 },
  { level: 2, title: "Trend Reader", minXp: 100 },
  { level: 3, title: "Setup Hunter", minXp: 250 },
  { level: 4, title: "Risk Manager", minXp: 500 },
  { level: 5, title: "Disciplined Trader", minXp: 800 },
  { level: 6, title: "Strategy Specialist", minXp: 1200 },
  { level: 7, title: "Trader Ready", minXp: 1700 },
] as const

export function getRoadmapTitle(xp: number): string {
  let title: string = TRADER_ROADMAP[0].title
  for (const step of TRADER_ROADMAP) {
    if (xp >= step.minXp) title = step.title
  }
  return title
}

export function getRoadmapLevel(xp: number): number {
  let level = 1
  for (const step of TRADER_ROADMAP) {
    if (xp >= step.minXp) level = step.level
  }
  return level
}

export function getNextRoadmapStep(xp: number): {
  title: string
  xpNeeded: number
} | null {
  for (const step of TRADER_ROADMAP) {
    if (xp < step.minXp) {
      return { title: step.title, xpNeeded: step.minXp - xp }
    }
  }
  return null
}
