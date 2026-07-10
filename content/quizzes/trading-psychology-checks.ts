import type { CourseQuiz } from "@/lib/course/types"

const PATH_ID = "trading-psychology"

/** Module 1 quiz — Probabilities. */
export const probabilitiesCheckQuiz: CourseQuiz = {
  id: "probabilities-check",
  lessonId: "tp-m1-quiz",
  pathId: PATH_ID,
  title: "Probabilities Check",
  description: "Edge, randomness, and process thinking.",
  passingScore: 70,
  xpReward: 50,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "Where does a trading edge actually show up?",
      options: [
        { id: "a", text: "In every individual trade" },
        { id: "b", text: "Over a large series of trades" },
        { id: "c", text: "Only in winning trades" },
        { id: "d", text: "In the first trade of the day" },
      ],
      correctAnswer: "b",
      explanation:
        "Edge is statistical — like a casino's. Any single trade is close to a coin flip; the series is where the tilt in your favour becomes visible.",
      relatedConcept: "Edge",
    },
    {
      id: "q2",
      type: "scenario",
      question:
        "A profitable system just produced five consecutive losses. The most likely explanation is:",
      options: [
        { id: "a", text: "The system is broken and must be replaced" },
        { id: "b", text: "Normal variance — five-loss streaks occur routinely at typical win rates" },
        { id: "c", text: "The market is targeting your stops" },
        { id: "d", text: "You should double size to recover faster" },
      ],
      correctAnswer: "b",
      explanation:
        "At a 50% win rate, a 5-loss streak appears about every 32 sequences. Abandoning a sound system mid-streak is how traders lose edges they actually had.",
      beginnerHint: "Think about the coin flip simulator — how often did streaks appear?",
      relatedConcept: "Randomness",
    },
    {
      id: "q3",
      type: "scenario",
      question:
        "A trader broke their rules — no stop, no setup — and made +2R. How should this trade be graded?",
      options: [
        { id: "a", text: "Good trade — it made money" },
        { id: "b", text: "Bad decision that got lucky — the win reinforces fatal behaviour" },
        { id: "c", text: "Neutral — outcomes are all that matter" },
        { id: "d", text: "Good trade if it's journaled honestly" },
      ],
      correctAnswer: "b",
      explanation:
        "Rule-breaking wins are the most expensive outcomes in trading: they train you to repeat behaviour that eventually produces uncapped losses.",
      relatedConcept: "Process over outcome",
    },
    {
      id: "q4",
      type: "true-false",
      question:
        "A rule-following trade that hits its stop loss was a good trade.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "true",
      explanation:
        "The decision was correct when made; the outcome was variance. Losses within the plan are budgeted business expenses.",
      relatedConcept: "Good losses",
    },
    {
      id: "q5",
      type: "multiple-choice",
      question: "Why do professionals feel little fear about individual losses?",
      options: [
        { id: "a", text: "They win almost every trade" },
        { id: "b", text: "Losses are expected, budgeted events — like a casino paying out a winning gambler" },
        { id: "c", text: "They trade without stops" },
        { id: "d", text: "They suppress all emotion through willpower" },
      ],
      correctAnswer: "b",
      explanation:
        "When one trade is just one of the next hundred, its outcome carries no emotional weight. The probabilistic frame IS the fear management.",
      relatedConcept: "Probabilistic mindset",
    },
  ],
}

/** Module 2 quiz — Emotions. */
export const emotionsCheckQuiz: CourseQuiz = {
  id: "emotions-check",
  lessonId: "tp-m2-quiz",
  pathId: PATH_ID,
  title: "Emotions Check",
  description: "Recognising the six trading emotions.",
  passingScore: 70,
  xpReward: 50,
  questions: [
    {
      id: "q1",
      type: "scenario",
      question:
        "Price rallied 80 pips without you. No setup exists, but you feel intense pressure to get in before it goes further. This is:",
      options: [
        { id: "a", text: "FOMO — and the correct action is standing aside" },
        { id: "b", text: "A momentum signal to buy" },
        { id: "c", text: "Greed — take a small position" },
        { id: "d", text: "Intuition worth trusting" },
      ],
      correctAnswer: "a",
      explanation:
        "Urgency without qualification is FOMO's signature. Late entries after extended moves carry the worst risk-reward on the chart.",
      relatedConcept: "FOMO",
    },
    {
      id: "q2",
      type: "scenario",
      question:
        "Your position broke its invalidation level but you're holding because it 'might come back'. This is:",
      options: [
        { id: "a", text: "Patience — winners need room" },
        { id: "b", text: "Hope trading — analysis has been replaced by wishing" },
        { id: "c", text: "Sound trade management" },
        { id: "d", text: "Averaging in" },
      ],
      correctAnswer: "b",
      explanation:
        "Past invalidation, no analysis supports the position — only hope. Every pip held is unbudgeted risk.",
      relatedConcept: "Hope",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "The reliable tell of a revenge trade is:",
      options: [
        { id: "a", text: "It's on a different pair than the loss" },
        { id: "b", text: "Urgency — the feeling that it must happen RIGHT NOW, usually at bigger size" },
        { id: "c", text: "It uses a stop loss" },
        { id: "d", text: "It happens in the afternoon" },
      ],
      correctAnswer: "b",
      explanation:
        "Real setups don't need to happen immediately. Post-loss urgency plus size inflation is the anatomy of revenge.",
      relatedConcept: "Revenge trading",
    },
    {
      id: "q4",
      type: "scenario",
      question:
        "After five straight wins you notice your risk has crept from 1% to 3% and setups 'don't need to be perfect anymore'. This is:",
      options: [
        { id: "a", text: "Earned confidence — streaks justify size" },
        { id: "b", text: "Overconfidence — the streak is variance and the size creep is the danger" },
        { id: "c", text: "Skill improvement" },
        { id: "d", text: "Normal system evolution" },
      ],
      correctAnswer: "b",
      explanation:
        "Streaks are what randomness looks like. The inflated size means the inevitable normal loss now erases weeks of profit.",
      relatedConcept: "Overconfidence",
    },
    {
      id: "q5",
      type: "multiple-choice",
      question: "How do professionals actually 'control' emotions?",
      options: [
        { id: "a", text: "Willpower — they feel nothing" },
        { id: "b", text: "They remove decision power from emotions using rules, checklists, and pre-placed orders" },
        { id: "c", text: "Meditation replaces trading rules" },
        { id: "d", text: "They trade smaller until fear disappears completely" },
      ],
      correctAnswer: "b",
      explanation:
        "Emotions can't be deleted — but a decision made in advance (stop placed, size calculated, plan written) can't be hijacked by them.",
      relatedConcept: "Emotional systems",
    },
  ],
}

/** Module 3 quiz — Habits. */
export const habitsCheckQuiz: CourseQuiz = {
  id: "habits-check",
  lessonId: "tp-m3-quiz",
  pathId: PATH_ID,
  title: "Habits Check",
  description: "Routine, journaling, and state management.",
  passingScore: 70,
  xpReward: 50,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "Why do routines produce discipline better than willpower?",
      options: [
        { id: "a", text: "They don't — willpower is superior" },
        { id: "b", text: "Routines move decisions OUT of emotional moments — pre-made decisions can't be hijacked" },
        { id: "c", text: "Routines guarantee profits" },
        { id: "d", text: "They make trading more exciting" },
      ],
      correctAnswer: "b",
      explanation:
        "By the time emotions arrive at the screen, the routine has already decided what qualifies, how much to risk, and when to stop.",
      relatedConcept: "Routine",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "What should the FIRST step of a trading day decide?",
      options: [
        { id: "a", text: "Which pair to trade" },
        { id: "b", text: "Whether you should trade at all today — sleep, stress, and state check" },
        { id: "c", text: "How much profit to target" },
        { id: "d", text: "What the news will say" },
      ],
      correctAnswer: "b",
      explanation:
        "The trader is part of the system. Degraded state trading perfect setups still produces bad trades.",
      relatedConcept: "State check",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "Why journal SKIPPED trades?",
      options: [
        { id: "a", text: "To feel productive" },
        { id: "b", text: "Skips reveal whether your filters add value and document discipline under temptation" },
        { id: "c", text: "Regulators require it" },
        { id: "d", text: "There's no reason — only executed trades matter" },
      ],
      correctAnswer: "b",
      explanation:
        "Your skip log is your discipline record. Over months it shows whether saying 'no' is protecting or costing you — data you can't get any other way.",
      relatedConcept: "Journaling",
    },
    {
      id: "q4",
      type: "scenario",
      question:
        "A journal review reveals every bad trade this month happened within 10 minutes of a loss. The correct response is:",
      options: [
        { id: "a", text: "Trade different pairs" },
        { id: "b", text: "Write a cooling-off principle: no orders for 30 minutes after any stop-out" },
        { id: "c", text: "Stop journaling — it's depressing" },
        { id: "d", text: "Increase size to recover losses faster" },
      ],
      correctAnswer: "b",
      explanation:
        "The journal found the leak; a written, checkable principle plugs it. This loop — journal, find pattern, write principle — is how traders actually improve.",
      relatedConcept: "Journal patterns",
    },
    {
      id: "q5",
      type: "true-false",
      question:
        "Sleep deprivation measurably increases risk-taking while increasing confidence — the most dangerous combination at the screen.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "true",
      explanation:
        "Tired traders take bigger risks and feel better about them. Sleep is a risk parameter, not a lifestyle preference.",
      relatedConcept: "State",
    },
  ],
}

/** Module 4 quiz — Professional Mindset. */
export const professionalMindsetCheckQuiz: CourseQuiz = {
  id: "professional-mindset-check",
  lessonId: "tp-m4-quiz",
  pathId: PATH_ID,
  title: "Professional Mindset Check",
  description: "Long-term thinking and compounding skill.",
  passingScore: 70,
  xpReward: 50,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "How does a professional view a losing day?",
      options: [
        { id: "a", text: "A crisis requiring immediate system changes" },
        { id: "b", text: "A business expense — as unremarkable as a restaurant buying ingredients" },
        { id: "c", text: "Proof they should quit" },
        { id: "d", text: "A reason to double size tomorrow" },
      ],
      correctAnswer: "b",
      explanation:
        "In business framing, losses are known costs and edge is the product. The emotional temperature drops to something sustainable for decades.",
      relatedConcept: "Business framing",
    },
    {
      id: "q2",
      type: "scenario",
      question:
        "Trader A alternates +20% and −30% months chasing excitement. Trader B compounds +2% monthly following boring rules. After two years:",
      options: [
        { id: "a", text: "A is far ahead — big wins compound faster" },
        { id: "b", text: "B is far ahead — A's math is actually negative while B compounds ~60%" },
        { id: "c", text: "They're roughly equal" },
        { id: "d", text: "Impossible to compare" },
      ],
      correctAnswer: "b",
      explanation:
        "+20% then −30% = −16% per cycle. Consistency doesn't just beat excitement emotionally — it beats it arithmetically.",
      beginnerHint: "Multiply 1.2 × 0.7 and see what's left.",
      relatedConcept: "Consistency",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "Why trade tiny size while learning?",
      options: [
        { id: "a", text: "Because brokers require it" },
        { id: "b", text: "The skills built are identical to full size, but mistakes cost pennies instead of accounts" },
        { id: "c", text: "Small size removes all emotion permanently" },
        { id: "d", text: "There's no reason — real learning needs real stakes" },
      ],
      correctAnswer: "b",
      explanation:
        "Skill compounds before money does. Paying full price for an education available at a discount is the amateur's tax.",
      relatedConcept: "Compounding skill",
    },
    {
      id: "q4",
      type: "multiple-choice",
      question: "According to the Dalio-style principles exercise, good trading principles come from:",
      options: [
        { id: "a", text: "Copying famous traders' rules verbatim" },
        { id: "b", text: "Your OWN journaled failure patterns, written as specific checkable rules" },
        { id: "c", text: "Whatever feels right in the moment" },
        { id: "d", text: "Maximising the number of rules" },
      ],
      correctAnswer: "b",
      explanation:
        "Pain + reflection = progress. Your journal shows where YOU leak money; principles convert each pattern into a pre-made decision.",
      relatedConcept: "Principles",
    },
  ],
}

/** Path milestone — Trading Psychology Assessment. */
export const tradingPsychologyAssessment: CourseQuiz = {
  id: "trading-psychology-assessment",
  lessonId: "tp-m5-quiz",
  pathId: PATH_ID,
  title: "Trading Psychology Assessment",
  description: "The milestone: probabilities, emotions, habits, and decisions together.",
  passingScore: 70,
  xpReward: 100,
  questions: [
    {
      id: "q1",
      type: "scenario",
      question:
        "Mid-session: three losses in a row (all rule-following), you feel urgency to 'make it back', and a half-qualifying setup appears. The framework verdict:",
      options: [
        { id: "a", text: "Trade — you're due a winner" },
        { id: "b", text: "Skip — half-qualification plus post-loss urgency is the revenge pattern" },
        { id: "c", text: "Trade at double size" },
        { id: "d", text: "Wait for it to fully qualify, then trade at double size" },
      ],
      correctAnswer: "b",
      explanation:
        "Two independent disqualifiers: an incomplete setup AND a compromised state. Either alone is a skip; together they're a loud one.",
      relatedConcept: "Trade, wait, skip",
    },
    {
      id: "q2",
      type: "scenario",
      question:
        "You skipped a setup because news was 15 minutes away. The move went on to win 3R without you. What did you learn?",
      options: [
        { id: "a", text: "The news rule costs money and should be dropped" },
        { id: "b", text: "Nothing new — the decision was correct when made; one outcome carries no information" },
        { id: "c", text: "You should enter faster next time" },
        { id: "d", text: "News doesn't matter" },
      ],
      correctAnswer: "b",
      explanation:
        "Grading the decision by this single outcome is 'resulting'. The rule's value shows up over the sample of ALL news skips — most of which dodge chaos.",
      relatedConcept: "Process over outcome",
    },
    {
      id: "q3",
      type: "scenario",
      question:
        "Weekly review shows: 12 trades (usual: 4), declining quality as the week progressed, and rising frustration in the emotion column. The diagnosis:",
      options: [
        { id: "a", text: "Great week — more trades means more practice" },
        { id: "b", text: "Overtrading — the filter stopped filtering, likely frustration-driven" },
        { id: "c", text: "The system needs more setups" },
        { id: "d", text: "Nothing notable" },
      ],
      correctAnswer: "b",
      explanation:
        "Trade count tripled while quality fell and frustration rose — the classic overtrading signature. The journal caught it; a principle should now address it.",
      relatedConcept: "Journal review",
    },
    {
      id: "q4",
      type: "multiple-choice",
      question: "The professional response to BOTH winning and losing streaks is:",
      options: [
        { id: "a", text: "Increase size in winning streaks, decrease in losing ones" },
        { id: "b", text: "Change nothing — same risk, same rules, same checklist" },
        { id: "c", text: "Stop trading during any streak" },
        { id: "d", text: "Switch systems" },
      ],
      correctAnswer: "b",
      explanation:
        "Streaks are variance. Reacting to them — in either direction — replaces math with emotion and destroys the edge being reacted to.",
      relatedConcept: "Streak response",
    },
    {
      id: "q5",
      type: "scenario",
      question:
        "You slept 4 hours and feel foggy, but today's market context is perfect. The state check says:",
      options: [
        { id: "a", text: "Trade normally — the market matters more than the trader" },
        { id: "b", text: "Skip or drastically reduce size — the trader is part of the system and today's trader is degraded" },
        { id: "c", text: "Trade bigger to stay alert" },
        { id: "d", text: "Coffee solves it" },
      ],
      correctAnswer: "b",
      explanation:
        "Sleep deprivation raises risk-taking while raising confidence — the worst combination. Perfect context traded by a compromised operator still produces bad trades.",
      relatedConcept: "State management",
    },
    {
      id: "q6",
      type: "true-false",
      question:
        "A week with 3 trades and 11 correct skips can be a better trading week than one with 15 trades and a bigger profit.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "true",
      explanation:
        "Decision quality compounds; lucky volume doesn't. The 3-trade week trains the exact discipline that survives decades.",
      relatedConcept: "Decision quality",
    },
  ],
}

export const TRADING_PSYCHOLOGY_QUIZZES: CourseQuiz[] = [
  probabilitiesCheckQuiz,
  emotionsCheckQuiz,
  habitsCheckQuiz,
  professionalMindsetCheckQuiz,
  tradingPsychologyAssessment,
]
