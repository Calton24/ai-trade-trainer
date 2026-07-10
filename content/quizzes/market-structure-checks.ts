import type { CourseQuiz } from "@/lib/course/types"

const PATH_ID = "market-structure-mastery"

/** Path milestone — Market Structure Assessment. */
export const marketStructureAssessment: CourseQuiz = {
  id: "market-structure-assessment",
  lessonId: "ms-quiz",
  pathId: PATH_ID,
  title: "Market Structure Assessment",
  description:
    "Prove you can read structure: swings, the four-point rule, trends, phases, continuation vs reversal, and the decision.",
  passingScore: 80,
  xpReward: 100,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "What defines a bullish (uptrend) market structure?",
      options: [
        { id: "a", text: "Lower Highs and Lower Lows" },
        { id: "b", text: "Higher Highs and Higher Lows" },
        { id: "c", text: "Equal highs and equal lows" },
        { id: "d", text: "Higher Highs and Lower Lows" },
      ],
      correctAnswer: "b",
      explanation:
        "An uptrend is a rising staircase: each peak is a Higher High and each trough a Higher Low.",
      relatedConcept: "Bullish structure",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "In a healthy uptrend, which swing is the key one to watch?",
      options: [
        { id: "a", text: "The Higher High — it confirms strength" },
        { id: "b", text: "The Higher Low — the first lower low is the first warning" },
        { id: "c", text: "The Lower High" },
        { id: "d", text: "None — only indicators matter" },
      ],
      correctAnswer: "b",
      explanation:
        "As long as pullbacks keep making higher lows, buyers are in control. The first LOWER low is the earliest structural warning.",
      relatedConcept: "Higher lows",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "What is the 'four-point rule'?",
      options: [
        { id: "a", text: "Only trade four times per day" },
        { id: "b", text: "Read the latest four swing points — four agreeing points confirm a trend" },
        { id: "c", text: "Risk exactly 4% per trade" },
        { id: "d", text: "Wait four candles before entering" },
      ],
      correctAnswer: "b",
      explanation:
        "You don't need the whole chart — the latest four turning points (high, low, high, low) tell you the trend when they agree.",
      relatedConcept: "Four-point rule",
    },
    {
      id: "q4",
      type: "scenario",
      question:
        "A clean uptrend (HH, HL, HH, HL) suddenly prints a LOWER low. What is the market attempting?",
      options: [
        { id: "a", text: "Continuation — nothing has changed" },
        { id: "b", text: "A possible reversal — the higher-low sequence just broke" },
        { id: "c", text: "A guaranteed reversal — go short immediately" },
        { id: "d", text: "A range" },
      ],
      correctAnswer: "b",
      explanation:
        "The first lower low breaks the uptrend's structure — a reversal WARNING. It's not yet confirmed, so professionals demand more evidence before committing.",
      beginnerHint: "Did the higher-low sequence hold or break?",
      relatedConcept: "Continuation vs reversal",
    },
    {
      id: "q5",
      type: "scenario",
      question:
        "A persistent downtrend (LH, LL, LH, LL) prints its first HIGHER high. This is:",
      options: [
        { id: "a", text: "Continuation of the downtrend" },
        { id: "b", text: "The earliest structural sign of a reversal" },
        { id: "c", text: "Irrelevant noise" },
        { id: "d", text: "A range confirmation" },
      ],
      correctAnswer: "b",
      explanation:
        "A first higher high breaks the lower-high sequence — the earliest structural hint the downtrend may be reversing.",
      relatedConcept: "Reversal detection",
    },
    {
      id: "q6",
      type: "multiple-choice",
      question: "What is Phase 1 in a trend?",
      options: [
        { id: "a", text: "The corrective pullback" },
        { id: "b", text: "The impulsive leg moving WITH the trend — the real direction" },
        { id: "c", text: "A range" },
        { id: "d", text: "The first hour of the session" },
      ],
      correctAnswer: "b",
      explanation:
        "Phase 1 is the strong, decisive impulse in the trend's direction. Phase 2 is the slower pullback against it.",
      relatedConcept: "Phases",
    },
    {
      id: "q7",
      type: "scenario",
      question:
        "Price is drifting slowly back against a strong uptrend on small overlapping candles. What phase is this, and what do you do?",
      options: [
        { id: "a", text: "Phase 1 — chase the move now" },
        { id: "b", text: "Phase 2 — prepare your entry, but don't trade INTO the pullback" },
        { id: "c", text: "Reversal — go short" },
        { id: "d", text: "Range — ignore it" },
      ],
      correctAnswer: "b",
      explanation:
        "This is the Phase 2 pullback. You never trade into it — you prepare, then enter as the next Phase 1 impulse resumes.",
      relatedConcept: "Phase 2",
    },
    {
      id: "q8",
      type: "scenario",
      question:
        "An uptrend has a deep pullback that nearly breaks the last higher low, followed by a weak impulse that barely makes a new high. How do you grade this trend?",
      options: [
        { id: "a", text: "Strong — new high confirmed" },
        { id: "b", text: "Weak / late — deep pullbacks and feeble breaks signal a tiring trend" },
        { id: "c", text: "It's actually a downtrend" },
        { id: "d", text: "It's a range" },
      ],
      correctAnswer: "b",
      explanation:
        "Deep pullbacks and weak breaks are the market whispering that the trend is running out of fuel — lower your confidence in continuation.",
      relatedConcept: "Trend quality",
    },
    {
      id: "q9",
      type: "scenario",
      question:
        "Uptrend intact, price pulled back to the higher-low zone (Phase 2), but the rejection candle hasn't confirmed yet. The decision is:",
      options: [
        { id: "a", text: "Trade now before you miss it" },
        { id: "b", text: "Wait — set an alert and enter only when Phase 1 resumes with confirmation" },
        { id: "c", text: "Skip — uptrends never continue" },
        { id: "d", text: "Go short into the pullback" },
      ],
      correctAnswer: "b",
      explanation:
        "Everything aligns except the trigger. That's a WAIT — entering before confirmation trades an unconfirmed setup with worse odds.",
      relatedConcept: "Trade, wait, skip",
    },
    {
      id: "q10",
      type: "scenario",
      question:
        "You planned a continuation long, but price sliced through the higher-low zone and printed a clear lower low on strong candles. Now you:",
      options: [
        { id: "a", text: "Trade the long anyway — the plan was set" },
        { id: "b", text: "Skip — the continuation thesis is invalidated; structure is transitioning" },
        { id: "c", text: "Add to the position at a better price" },
        { id: "d", text: "Move your stop lower to give it room" },
      ],
      correctAnswer: "b",
      explanation:
        "The higher low broke — your continuation idea is dead. Never trade a continuation whose structure just failed. Skip and reassess.",
      relatedConcept: "Invalidation",
    },
  ],
}

export const MARKET_STRUCTURE_QUIZZES: CourseQuiz[] = [marketStructureAssessment]
