export const MISTAKE_CODES = [
  "wrong-direction",
  "wrong-strategy",
  "forced-trade",
  "missed-no-trade",
  "entered-too-early",
  "entered-too-late",
  "stop-too-tight",
  "stop-too-wide",
  "poor-risk-reward",
  "over-risked",
  "against-htf-bias",
  "ignored-structure",
  "misread-pullback",
  "misread-reversal",
  "moved-stop-too-early",
  "closed-winner-too-early",
  "held-through-invalidation",
  "overconfident",
  "underconfident",
] as const

export type MistakeCode = (typeof MISTAKE_CODES)[number]

export const MISTAKE_LABELS: Record<MistakeCode, string> = {
  "wrong-direction": "Wrong direction",
  "wrong-strategy": "Wrong strategy",
  "forced-trade": "Forced trade when patience was correct",
  "missed-no-trade": "Missed no-trade opportunity",
  "entered-too-early": "Entered too early",
  "entered-too-late": "Entered too late",
  "stop-too-tight": "Stop too tight",
  "stop-too-wide": "Stop too wide",
  "poor-risk-reward": "Poor risk/reward",
  "over-risked": "Over-risked position",
  "against-htf-bias": "Traded against higher-timeframe bias",
  "ignored-structure": "Ignored structure",
  "misread-pullback": "Misread pullback as reversal",
  "misread-reversal": "Misread reversal as pullback",
  "moved-stop-too-early": "Moved stop too early",
  "closed-winner-too-early": "Closed winner too early",
  "held-through-invalidation": "Held through invalidation",
  overconfident: "Overconfident",
  underconfident: "Underconfident",
}

export function isMistakeCode(value: string): value is MistakeCode {
  return (MISTAKE_CODES as readonly string[]).includes(value)
}
