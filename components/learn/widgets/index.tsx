"use client"

import type { LessonWidget } from "@/lib/course/widgets"

import { PipCalculator, PositionSizeCalculator } from "./calculators"
import { DecisionScenarios, WeeklyPlanner } from "./decision-scenarios"
import {
  ContinuationPredictor,
  SwingLabeler,
  TrendBuilder,
} from "./market-structure"
import { MatchPairs } from "./match-pairs"
import { OrderSteps } from "./order-steps"
import {
  CoinFlipSimulator,
  ExpectancySimulator,
  SessionClock,
} from "./simulators"
import { SortBuckets } from "./sort-buckets"
import { DailyChecklist, JournalReview, WatchlistBuilder } from "./workflow"

/** Renders any interactive lesson widget from its typed config. */
export function LessonWidgetRenderer({ widget }: { widget: LessonWidget }) {
  switch (widget.kind) {
    case "sort-buckets":
      return <SortBuckets widget={widget} />
    case "match-pairs":
      return <MatchPairs widget={widget} />
    case "order-steps":
      return <OrderSteps widget={widget} />
    case "decision-scenarios":
      return <DecisionScenarios widget={widget} />
    case "weekly-planner":
      return <WeeklyPlanner widget={widget} />
    case "pip-calculator":
      return <PipCalculator widget={widget} />
    case "position-size-calculator":
      return <PositionSizeCalculator widget={widget} />
    case "expectancy-simulator":
      return <ExpectancySimulator widget={widget} />
    case "coin-flip":
      return <CoinFlipSimulator widget={widget} />
    case "session-clock":
      return <SessionClock widget={widget} />
    case "watchlist-builder":
      return <WatchlistBuilder widget={widget} />
    case "daily-checklist":
      return <DailyChecklist widget={widget} />
    case "journal-review":
      return <JournalReview widget={widget} />
    case "swing-labeler":
      return <SwingLabeler widget={widget} />
    case "continuation-predictor":
      return <ContinuationPredictor widget={widget} />
    case "trend-builder":
      return <TrendBuilder widget={widget} />
    default:
      return null
  }
}
