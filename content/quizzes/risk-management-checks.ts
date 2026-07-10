import type { CourseQuiz } from "@/lib/course/types"

const PATH_ID = "risk-management"

/** Module 1 quiz — Understanding Risk. */
export const understandingRiskCheckQuiz: CourseQuiz = {
  id: "understanding-risk-check",
  lessonId: "rm-m1-quiz",
  pathId: PATH_ID,
  title: "Understanding Risk Check",
  description: "Ruin math and percentage risk.",
  passingScore: 70,
  xpReward: 50,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "You lose 50% of your account. What gain do you need to recover?",
      options: [
        { id: "a", text: "50%" },
        { id: "b", text: "75%" },
        { id: "c", text: "100%" },
        { id: "d", text: "150%" },
      ],
      correctAnswer: "c",
      explanation:
        "From half the capital, you must double what's left. Drawdown math is asymmetric — that's why professionals keep losses small.",
      beginnerHint: "From $5,000 back to $10,000 is what percentage of $5,000?",
      relatedConcept: "Risk of ruin",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "Why is percentage risk safer than fixed-dollar risk?",
      options: [
        { id: "a", text: "It always risks more money" },
        { id: "b", text: "It scales down automatically in drawdowns, extending survival" },
        { id: "c", text: "Brokers require it" },
        { id: "d", text: "It guarantees profit" },
      ],
      correctAnswer: "b",
      explanation:
        "1% of a shrinking account shrinks too — the risk gets defensive exactly when you need it to.",
      relatedConcept: "Percentage risk",
    },
    {
      id: "q3",
      type: "scenario",
      question:
        "A trader with a 50% win rate risks 10% per trade. A normal 5-loss streak arrives. Roughly what happens?",
      options: [
        { id: "a", text: "Loses ~5% — easily recovered" },
        { id: "b", text: "Loses ~41% — needs a 69% gain to recover" },
        { id: "c", text: "Nothing, because the win rate protects them" },
        { id: "d", text: "The streak is impossible at a 50% win rate" },
      ],
      correctAnswer: "b",
      explanation:
        "0.9^5 ≈ 0.59 of the account remains. Five-loss streaks are ROUTINE at 50% win rates — sizing must assume they will happen.",
      relatedConcept: "Losing streaks",
    },
    {
      id: "q4",
      type: "true-false",
      question:
        "With positive expectancy and 1% risk per trade, a losing streak is an inconvenience rather than a threat.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "true",
      explanation:
        "Eight straight 1% losses cost ~7.7% — recoverable. The same streak at 10% risk costs ~57%. Size determines whether variance is noise or ruin.",
      relatedConcept: "Survival",
    },
    {
      id: "q5",
      type: "multiple-choice",
      question: "What actually kills most trading accounts?",
      options: [
        { id: "a", text: "Bad chart analysis" },
        { id: "b", text: "Broker fees" },
        { id: "c", text: "Oversized risk meeting a normal losing streak" },
        { id: "d", text: "Trading the wrong pairs" },
      ],
      correctAnswer: "c",
      explanation:
        "Streaks are guaranteed; oversized risk turns a guaranteed event into a fatal one. Analysis quality only determines how often streaks occur.",
      relatedConcept: "Why traders fail",
    },
  ],
}

/** Module 2 quiz — Position Sizing. */
export const positionSizingCheckQuiz: CourseQuiz = {
  id: "position-sizing-check",
  lessonId: "rm-m2-quiz",
  pathId: PATH_ID,
  title: "Position Sizing Check",
  description: "The sizing formula under different conditions.",
  passingScore: 70,
  xpReward: 50,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question:
        "Account $10,000, risk 1%, stop 25 pips, pip value $10/lot. Position size?",
      options: [
        { id: "a", text: "0.25 lots" },
        { id: "b", text: "0.40 lots" },
        { id: "c", text: "1.00 lot" },
        { id: "d", text: "0.10 lots" },
      ],
      correctAnswer: "b",
      explanation: "$100 ÷ (25 × $10) = 0.40 lots.",
      beginnerHint: "Risk amount first ($100), then divide by stop × pip value.",
      relatedConcept: "Sizing formula",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question:
        "Same account and risk, but the stop widens from 25 to 50 pips. The correct size:",
      options: [
        { id: "a", text: "Stays the same" },
        { id: "b", text: "Doubles to 0.80 lots" },
        { id: "c", text: "Halves to 0.20 lots" },
        { id: "d", text: "Becomes zero — wide stops are untradeable" },
      ],
      correctAnswer: "c",
      explanation:
        "Double the stop distance = half the size at identical dollar risk. Size absorbs volatility so risk doesn't have to.",
      relatedConcept: "Stop-size relationship",
    },
    {
      id: "q3",
      type: "scenario",
      question:
        "The chart demands a 60-pip stop, but at your minimum lot size that's 2.5% risk. The professional response is:",
      options: [
        { id: "a", text: "Take it — good setups justify extra risk" },
        { id: "b", text: "Tighten the stop to 20 pips to fit 1%" },
        { id: "c", text: "Skip the trade — it doesn't fit your risk parameters" },
        { id: "d", text: "Remove the stop and watch closely" },
      ],
      correctAnswer: "c",
      explanation:
        "The stop belongs at invalidation, and risk caps at 1%. When those can't coexist, the trade doesn't exist. Skipping IS the risk management.",
      relatedConcept: "Skip discipline",
    },
    {
      id: "q4",
      type: "true-false",
      question:
        "Position size is the first thing to decide when planning a trade.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "false",
      explanation:
        "Size is the LAST variable — an output calculated from risk % and stop distance, never a starting choice.",
      relatedConcept: "Sizing order",
    },
    {
      id: "q5",
      type: "multiple-choice",
      question:
        "After losses shrink the account from $10,000 to $8,000, a 1% risk trade with a 20-pip stop ($10/pip per lot) should be:",
      options: [
        { id: "a", text: "0.50 lots — same as before the losses" },
        { id: "b", text: "0.40 lots — 1% of the CURRENT balance" },
        { id: "c", text: "1.00 lot to recover faster" },
        { id: "d", text: "Zero — you should stop after any drawdown" },
      ],
      correctAnswer: "b",
      explanation:
        "$80 ÷ (20 × $10) = 0.40 lots. Percentage risk always references current balance — that's its survival mechanism.",
      relatedConcept: "Percentage risk in drawdown",
    },
  ],
}

/** Module 3 quiz — Stop Loss. */
export const stopLossCheckQuiz: CourseQuiz = {
  id: "stop-loss-check",
  lessonId: "rm-m3-quiz",
  pathId: PATH_ID,
  title: "Stop Loss Check",
  description: "Invalidation, structure, and ATR.",
  passingScore: 70,
  xpReward: 50,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "Where does a stop loss belong?",
      options: [
        { id: "a", text: "At the dollar amount you're comfortable losing" },
        { id: "b", text: "At the level where the trade idea is objectively wrong" },
        { id: "c", text: "A fixed 10 pips from every entry" },
        { id: "d", text: "Stops are optional for experienced traders" },
      ],
      correctAnswer: "b",
      explanation:
        "The stop marks invalidation. Comfort-based and fixed-distance stops ignore the only thing that matters: the chart.",
      relatedConcept: "Invalidation",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "You're long from an uptrend pullback. The structural stop goes:",
      options: [
        { id: "a", text: "Above the recent lower high" },
        { id: "b", text: "Below the recent higher low, with a small buffer" },
        { id: "c", text: "Exactly at your entry price" },
        { id: "d", text: "At yesterday's close" },
      ],
      correctAnswer: "b",
      explanation:
        "The higher low defines the uptrend. If it breaks, the structure — and your idea — is gone. The buffer survives routine wicks.",
      relatedConcept: "Structure stops",
    },
    {
      id: "q3",
      type: "scenario",
      question:
        "Hourly ATR is 18 pips. Your planned stop is 10 pips from entry. What's the problem?",
      options: [
        { id: "a", text: "Nothing — tighter stops mean bigger positions" },
        { id: "b", text: "The stop sits inside normal candle noise — routine movement will kill the trade" },
        { id: "c", text: "The stop is too wide for this volatility" },
        { id: "d", text: "ATR is irrelevant to stops" },
      ],
      correctAnswer: "b",
      explanation:
        "A stop inside the average candle range gets hit by noise, not by being wrong. Widen to beyond structure + ATR, and shrink size instead.",
      beginnerHint: "Can a normal candle reach your stop by accident?",
      relatedConcept: "ATR",
    },
    {
      id: "q4",
      type: "scenario",
      question:
        "Price approaches your stop. You're tempted to move it 15 pips lower 'to give the trade room'. This is:",
      options: [
        { id: "a", text: "Prudent trade management" },
        { id: "b", text: "The single most reliable way to turn small losses into disasters" },
        { id: "c", text: "Fine, if the setup was good" },
        { id: "d", text: "Required by most brokers" },
      ],
      correctAnswer: "b",
      explanation:
        "The original stop marked invalidation — the idea IS wrong. Moving it away replaces a planned 1R loss with an unplanned larger one. Stops only tighten.",
      relatedConcept: "Never move the stop",
    },
    {
      id: "q5",
      type: "true-false",
      question:
        "Being stopped out at a logical structural level means the trade was managed correctly, even though it lost.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "true",
      explanation:
        "A rule-following loss at invalidation is the system working: small, planned, and survivable. Process over outcome.",
      relatedConcept: "Good losses",
    },
  ],
}

/** Module 4 quiz — Risk : Reward. */
export const riskRewardCheckQuiz: CourseQuiz = {
  id: "risk-reward-check",
  lessonId: "rm-m4-quiz",
  pathId: PATH_ID,
  title: "Risk : Reward Check",
  description: "R-multiples and expectancy math.",
  passingScore: 70,
  xpReward: 50,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question:
        "You risk $100 with a target worth $300. The trade wins. In R terms you made:",
      options: [
        { id: "a", text: "+1R" },
        { id: "b", text: "+2R" },
        { id: "c", text: "+3R" },
        { id: "d", text: "+300R" },
      ],
      correctAnswer: "c",
      explanation: "Reward ÷ risk = $300 ÷ $100 = 3R. R-multiples normalise every trade.",
      relatedConcept: "R-multiples",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "At a 1:2 risk-reward ratio, the minimum win rate to break even is roughly:",
      options: [
        { id: "a", text: "50%" },
        { id: "b", text: "34%" },
        { id: "c", text: "66%" },
        { id: "d", text: "25%" },
      ],
      correctAnswer: "b",
      explanation:
        "Break-even win rate = 1 ÷ (1 + R) = 1 ÷ 3 ≈ 33.4%. Higher reward ratios buy you tolerance for losing.",
      beginnerHint: "One win covers two losses — so you need to win about one in three.",
      relatedConcept: "Break-even win rate",
    },
    {
      id: "q3",
      type: "scenario",
      question:
        "System A: 60% win rate at 1:0.5 reward. System B: 40% win rate at 1:2. Which has positive expectancy?",
      options: [
        { id: "a", text: "A only — higher win rate always wins" },
        { id: "b", text: "B only: (0.4×2) − (0.6×1) = +0.2R vs A's (0.6×0.5) − (0.4×1) = −0.1R" },
        { id: "c", text: "Both are profitable" },
        { id: "d", text: "Neither is profitable" },
      ],
      correctAnswer: "b",
      explanation:
        "Run the equation, not the intuition. The 'worse' win rate is the profitable system — win rate alone tells you nothing.",
      relatedConcept: "Expectancy",
    },
    {
      id: "q4",
      type: "true-false",
      question:
        "Setting a 1:10 target always improves a system because the reward is bigger.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "false",
      explanation:
        "If price realistically never travels 10R before hitting your stop, your win rate collapses and expectancy goes negative. Targets must be levels the market actually reaches.",
      relatedConcept: "Realistic targets",
    },
    {
      id: "q5",
      type: "multiple-choice",
      question: "Over how many trades should you judge whether a system works?",
      options: [
        { id: "a", text: "5 — a losing week means a broken system" },
        { id: "b", text: "A large sample (100+) — expectancy is invisible in small samples" },
        { id: "c", text: "1 — each trade proves or disproves the edge" },
        { id: "d", text: "Systems can't be evaluated" },
      ],
      correctAnswer: "b",
      explanation:
        "Positive-expectancy systems produce brutal short-term streaks. Only samples reveal the signal beneath the noise.",
      relatedConcept: "Sample size",
    },
  ],
}

/** Path milestone — Risk Management Assessment. */
export const riskManagementAssessment: CourseQuiz = {
  id: "risk-management-assessment",
  lessonId: "rm-m5-quiz",
  pathId: PATH_ID,
  title: "Risk Management Assessment",
  description: "The milestone: apply the complete risk system.",
  passingScore: 70,
  xpReward: 100,
  questions: [
    {
      id: "q1",
      type: "scenario",
      question:
        "Account $6,000, risk 1%, stop 30 pips, pip value $10/lot. Correct size?",
      options: [
        { id: "a", text: "0.20 lots" },
        { id: "b", text: "0.60 lots" },
        { id: "c", text: "0.30 lots" },
        { id: "d", text: "2.00 lots" },
      ],
      correctAnswer: "a",
      explanation: "$60 ÷ (30 × $10) = 0.20 lots.",
      relatedConcept: "Position sizing",
    },
    {
      id: "q2",
      type: "scenario",
      question:
        "You're down 3% today — your daily limit. The best setup of the week appears. You:",
      options: [
        { id: "a", text: "Take it at half size as a compromise" },
        { id: "b", text: "Take it at normal size — setups override limits" },
        { id: "c", text: "Stop trading — the limit exists precisely for this moment" },
        { id: "d", text: "Take it at double size to recover the day" },
      ],
      correctAnswer: "c",
      explanation:
        "A limit with exceptions is not a limit. The moment it feels hardest to obey is the moment it's protecting you from.",
      relatedConcept: "Loss limits",
    },
    {
      id: "q3",
      type: "scenario",
      question:
        "Your long is 3 pips above the stop and 'looks ready to bounce'. The professional action is:",
      options: [
        { id: "a", text: "Move the stop 20 pips lower for room" },
        { id: "b", text: "Add to the position at a better price" },
        { id: "c", text: "Nothing — the stop is at invalidation; let the market decide" },
        { id: "d", text: "Close half and move the stop" },
      ],
      correctAnswer: "c",
      explanation:
        "The plan was made calmly before entry. Mid-trade 'adjustments' near the stop are emotion wearing a strategy costume.",
      relatedConcept: "Never move the stop",
    },
    {
      id: "q4",
      type: "multiple-choice",
      question:
        "A trade risking 25 pips targets a level 50 pips away. You win 45% of such trades. Expectancy per trade?",
      options: [
        { id: "a", text: "+0.35R — profitable" },
        { id: "b", text: "−0.10R — losing" },
        { id: "c", text: "0R — break-even" },
        { id: "d", text: "+2R — the ratio is the expectancy" },
      ],
      correctAnswer: "a",
      explanation:
        "(0.45 × 2R) − (0.55 × 1R) = 0.9 − 0.55 = +0.35R per trade. A sub-50% win rate compounding steadily.",
      beginnerHint: "Win% × reward R minus loss% × 1.",
      relatedConcept: "Expectancy",
    },
    {
      id: "q5",
      type: "scenario",
      question:
        "After four straight wins you feel unstoppable and want to triple size on trade five. The rulebook says:",
      options: [
        { id: "a", text: "Streaks earn bigger size — go for it" },
        { id: "b", text: "Risk stays identical after wins and losses — 1%, same as always" },
        { id: "c", text: "Triple size but tighten the stop" },
        { id: "d", text: "Skip trade five entirely — winning streaks predict losses" },
      ],
      correctAnswer: "b",
      explanation:
        "The next trade's odds don't know about your streak. Euphoria sizing after wins destroys accounts as reliably as revenge sizing after losses.",
      relatedConcept: "Risk consistency",
    },
    {
      id: "q6",
      type: "scenario",
      question:
        "Day summary: two trades, both losses, both at 1% with structural stops, stopped at invalidation, done for the day at −2%. How do you grade this day?",
      options: [
        { id: "a", text: "Failure — losing days are bad days" },
        { id: "b", text: "A-grade — perfect process; the outcome was variance" },
        { id: "c", text: "C-grade — should have moved the stops" },
        { id: "d", text: "Ungradeable without knowing the P&L in dollars" },
      ],
      correctAnswer: "b",
      explanation:
        "Every rule followed, every loss planned and small. Repeat this process and the math takes care of the rest. Grade adherence, not outcome.",
      relatedConcept: "Process over outcome",
    },
    {
      id: "q7",
      type: "true-false",
      question: "Rule #1 of professional trading is to protect your capital — survive first, grow second.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "true",
      explanation:
        "Everything in this path serves that rule. An account that survives can compound; one that doesn't can't do anything.",
      relatedConcept: "Rule #1",
    },
  ],
}

export const RISK_MANAGEMENT_QUIZZES: CourseQuiz[] = [
  understandingRiskCheckQuiz,
  positionSizingCheckQuiz,
  stopLossCheckQuiz,
  riskRewardCheckQuiz,
  riskManagementAssessment,
]
