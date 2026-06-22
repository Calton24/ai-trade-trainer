import type { Drill, DrillType, TradeMarkType } from "@/lib/types"

export const drills: Drill[] = [
  {
    id: "drill-support",
    type: "identify_support",
    title: "Identify Support",
    description: "Find the price level where buyers have repeatedly stepped in.",
    difficulty: "beginner",
    requiredMarks: ["support"],
    instructions: "Click on the chart to mark the main support level where price has bounced.",
  },
  {
    id: "drill-resistance",
    type: "identify_resistance",
    title: "Identify Resistance",
    description: "Find the ceiling where sellers have pushed price down.",
    difficulty: "beginner",
    requiredMarks: ["resistance"],
    instructions: "Click on the chart to mark the key resistance level.",
  },
  {
    id: "drill-trend",
    type: "spot_trend",
    title: "Spot the Trend",
    description: "Decide whether price is in an uptrend, downtrend, or range.",
    difficulty: "beginner",
    requiredMarks: ["trend"],
    instructions: "Mark the trend direction by clicking on the most recent swing structure.",
  },
  {
    id: "drill-break",
    type: "mark_break",
    title: "Mark the Break",
    description: "Identify where price broke through a key resistance level.",
    difficulty: "beginner",
    requiredMarks: ["break"],
    instructions: "Mark the level where price broke above resistance with a closing candle.",
  },
  {
    id: "drill-retest",
    type: "mark_retest",
    title: "Mark the Retest",
    description: "Find where price returned to test the broken level as support.",
    difficulty: "beginner",
    requiredMarks: ["retest"],
    instructions: "Mark the retest zone where price came back to the broken level.",
  },
  {
    id: "drill-full-setup",
    type: "place_entry_sl_tp",
    title: "Full Setup Practice",
    description: "Mark entry, stop loss, and take profit for a complete Break & Retest plan.",
    difficulty: "beginner",
    requiredMarks: ["break", "retest", "entry", "stop_loss", "take_profit"],
    instructions: "Mark the break, retest, entry, stop loss, and take profit to complete the setup.",
  },
]

export const drillMarkMap: Record<DrillType, TradeMarkType[]> = {
  identify_support: ["support"],
  identify_resistance: ["resistance"],
  spot_trend: ["trend"],
  mark_break: ["break"],
  mark_retest: ["retest"],
  place_entry_sl_tp: ["break", "retest", "entry", "stop_loss", "take_profit"],
}

export function getDrillByType(type: DrillType) {
  return drills.find((d) => d.type === type)
}

export function getDrillById(id: string) {
  return drills.find((d) => d.id === id)
}
