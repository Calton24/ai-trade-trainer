import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "professional-forex"
const MODULE_ID = "pf-m5"

/** Stage 17 — Professional Trading Operating System. The repeatable daily process. */
export const operatingSystemModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Professional Trading Operating System",
  description:
    "Turn everything you've learned into the repeatable daily process professional traders run: routine, targets, risk rules, management, review, and mindset.",
  order: 5,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "pf-m5-daily-routine",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "daily-trading-routine",
      title: "The Daily Trading Routine",
      description: "The morning-to-close sequence professionals run every day.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 1,
      xpReward: 60,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Daily Trading Routine" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "A professional trader's day is not a hunt for excitement — it's the same operating system booted up every morning. Each step exists because you've now learned the stage behind it. This routine IS the course, compressed into a daily practice.",
        },
        {
          id: "check1",
          type: "checklist",
          content: "The daily operating system:",
          metadata: {
            items: [
              "Check market context — direction, DXY, sentiment (Stage 13)",
              "Verify positioning — HTF agreement, phases, zones (Stage 14)",
              "Build the watchlist — filter and score pairs (Stage 16)",
              "Classify each market and select a framework (Stage 15)",
              "Run the decision engine — execute ONLY if everything aligns",
              "Manage open trades by their pre-defined rules",
              "Journal everything — trades taken AND trades skipped",
            ],
          },
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "The routine's power is that it's identical on every market, every instrument, every day. New strategy? It drops into the same workflow. Gold, indices, crypto? Same workflow. The routine is the spine — everything else plugs into it.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "ex1",
          type: "example",
          content:
            "07:30 — coffee and context: daily charts, DXY, calendar, sentiment. 08:00 — watchlist built: USDJPY (continuation, score 11), EURUSD (watch only). 08:15 — decision engine on USDJPY: all checks pass, framework selected, orders planned with stop and target. 12:30 — trade triggered and managed by plan. 16:00 — journal: one trade taken, two skips recorded with reasons. Done.",
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Running the routine only on days you 'feel like trading'. Consistency is the entire point — a routine you follow sometimes is not a routine, it's a mood.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Context → positioning → watchlist → classification → decision engine → manage → journal. One repeatable sequence, every trading day, on any market.",
        },
      ],
    },
    {
      id: "pf-m5-pip-targets",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "pip-targets-as-training-objectives",
      title: "Pip Targets as Training Objectives",
      description: "What a 20-pips-a-day goal is really for — and what it isn't.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 2,
      xpReward: 55,
      prerequisites: ["pf-m5-daily-routine"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Pip Targets as Training Objectives" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Many developing traders adopt a modest pip objective — around 20 pips per day, roughly 100 pips per week — as a training goal. Understood correctly, it's a useful discipline tool. Misunderstood, it becomes a reason to force trades. This lesson makes sure you're in the first group.",
        },
        {
          id: "def-training-target",
          type: "definition",
          content:
            "A process benchmark used to encourage patience, disciplined exits, and consistency — NOT a promise of what the market offers, and not an income figure. The right number depends on the market, the strategy, and the trader.",
          metadata: { term: "Pip training target" },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "What the target teaches: take the clean, modest opportunity rather than holding out for home runs; bank consistency before thinking about size; measure weeks, not single days. What it must never do: pressure you into trading when your decision engine says skip. On a no-trade day, the target is simply not in play — and that day still counts as a success if you followed your process.",
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "Measure success by process execution, not pips collected. Some days the correct output of a professional process is zero trades and zero pips — that is the process working, not failing.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "It's 15:00, you're at 8 pips, and you start hunting for a setup to 'finish the day'. That trade has no edge — it exists to serve a number. This is exactly how training targets damage accounts.",
          metadata: { variant: "mistake" },
        },
        {
          id: "w-weekly-planner",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "weekly-planner",
            prompt:
              "Run a training week with a 20-pip daily objective. You're scored on decision quality — NOT on pips collected.",
            days: [
              {
                day: "Monday",
                situation:
                  "Clean A+ continuation setup on EUR/USD during London. Context, positioning, and calendar all agree.",
                correct: "trade",
                coaching:
                  "Full alignment — this is the trade the objective exists for. Take the clean, modest opportunity.",
              },
              {
                day: "Tuesday",
                situation:
                  "You're at 12 pips for the week. Charts are messy everywhere and DXY is contradicting your watchlist pairs.",
                correct: "skip",
                coaching:
                  "The number never overrides the process. Messy charts + contradicting context = skip, regardless of where the weekly count stands.",
              },
              {
                day: "Wednesday",
                situation:
                  "FOMC tonight. A decent setup is forming on USD/JPY but won't complete until an hour before the release.",
                correct: "skip",
                coaching:
                  "Entering shortly before FOMC hands the outcome to the news. No setup quality survives that coin flip.",
              },
              {
                day: "Thursday",
                situation:
                  "Post-FOMC direction is clear. Price is pulling back toward your zone but hasn't reached it yet.",
                correct: "wait",
                coaching:
                  "The idea qualifies; the location doesn't — yet. Set the alert and let price come to you.",
              },
              {
                day: "Friday",
                situation:
                  "Thursday's wait filled and won (+24 pips). Today a B-grade setup appears — you're at 40 pips and 'one more win' would look great in the journal.",
                correct: "skip",
                coaching:
                  "B-grade setups to pad a number are exactly how good weeks turn mediocre. Two quality decisions made this week profitable; protect them.",
              },
            ],
          },
        },
        {
          id: "safety",
          type: "safety-note",
          content:
            "Educational simulator only. Not financial advice. Pip targets are training examples: actual results depend on account size, risk settings, market conditions, and execution quality. No target is a guarantee of income.",
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "A modest pip target trains patience and consistency — judged over weeks, never forced in a day. The decision engine always outranks the target.",
        },
      ],
    },
    {
      id: "pf-m5-risk-rules",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "professional-risk-rules",
      title: "Professional Risk Rules",
      description: "The non-negotiable rules that keep traders in the game.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 3,
      xpReward: 65,
      prerequisites: ["pf-m5-pip-targets"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Professional Risk Rules" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "You covered risk management fundamentals earlier in the academy. This lesson upgrades them into the professional's non-negotiables — the rules that are never bent, because bending them once teaches you they can be bent.",
        },
        {
          id: "check1",
          type: "checklist",
          content: "The professional risk rules:",
          metadata: {
            items: [
              "Risk a fixed, small percentage per trade — around 1% or less",
              "Stop-loss is defined BEFORE entry, at the level that proves you wrong",
              "Take-profit is defined BEFORE entry — plan the exit while objective",
              "Never widen or move the stop-loss away from price. Ever.",
              "Maintain a sensible risk-to-reward ratio for the strategy in play",
              "Protect capital first — the account is the business",
            ],
          },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "The deepest rule is the last mindset shift: judge yourself by rule adherence, not by whether an individual trade won. A rule-following loss is a good trade. A rule-breaking win is a bad trade that paid you — and it's the more dangerous of the two, because it rewards the exact behaviour that eventually ends accounts.",
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "'Never move the stop' really means: the stop marks where your idea is wrong. Moving it doesn't protect the trade — it converts a small planned loss into an unplanned large one.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "ex1",
          type: "example",
          content:
            "At 1% risk per trade, a losing streak of five — which will happen — costs about 5% of the account. Fully recoverable. At 10% risk per trade, the same streak costs roughly 40%. The maths of small risk is what makes long careers possible.",
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Increasing size after wins and after losses — bigger 'because I'm hot' or bigger 'to win it back'. Both are emotions setting your risk. The fixed percentage exists to take that decision away from your feelings.",
          metadata: { variant: "mistake" },
        },
        {
          id: "safety",
          type: "safety-note",
          content:
            "Educational simulator only. Not financial advice. Risk rules limit damage; they do not create profits.",
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Small fixed risk, stop and target set before entry, stop never moved, capital protected first — and self-judgement based on rule adherence, not single outcomes.",
        },
      ],
    },
    {
      id: "pf-m5-trade-management",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "trade-management",
      title: "Trade Management",
      description: "Entry, stop, target, size — the complete order plan.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 4,
      xpReward: 60,
      prerequisites: ["pf-m5-risk-rules"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Trade Management" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "A professional trade is fully specified before the entry order exists. Five numbers, written down: entry, stop-loss, take-profit, position size, and how many positions you already have open. If you can't state all five, you don't have a trade — you have an urge.",
        },
        {
          id: "check1",
          type: "checklist",
          content: "The complete trade plan:",
          metadata: {
            items: [
              "Entry — the exact level or trigger, chosen from your framework",
              "Stop-loss — where the setup is invalidated (this defines your risk)",
              "Take-profit — the logical target: structure, prior high/low, or measured move",
              "Position size — calculated FROM the stop distance so risk stays ~1%",
              "Position count — still within the maximum of 3 open positions?",
            ],
          },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Note the order of operations for sizing: stop distance comes first, size comes second. A wide stop means a smaller position; a tight stop allows a larger one — the money at risk stays constant. Beginners choose a size they like and then find a stop that 'fits'; professionals do the reverse.",
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "Once the trade is live, your only job is to execute the plan you wrote while you were objective. In-trade 'creativity' is almost always fear or greed wearing a disguise.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Watching every tick after entry. The plan defined your exits — obsessive monitoring only generates temptation to interfere. Set alerts at your levels and step back.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Entry, stop, target, size, position count — all five decided before entry, size always derived from stop distance, and the plan executed without improvisation.",
        },
      ],
    },
    {
      id: "pf-m5-weekly-review",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "weekly-review",
      title: "The Weekly Review",
      description: "Build stats. The stats never end.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 5,
      xpReward: 60,
      prerequisites: ["pf-m5-trade-management"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Weekly Review" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "The daily routine generates data; the weekly review turns it into improvement. Every week, professionals sit down with their journal and build their stats — and here's the truth that separates careers from hobbies: the stats never end. Review is a permanent part of the job, not a beginner phase.",
        },
        {
          id: "check1",
          type: "checklist",
          content: "The weekly review agenda:",
          metadata: {
            items: [
              "Every trade taken — was the process followed? (rule adherence %)",
              "Every trade skipped — were the skips correct in hindsight?",
              "Wins AND losses — was each one a good decision or a lucky/unlucky one?",
              "Which watchlist scores predicted the best trades?",
              "One specific thing to do better next week — written down",
            ],
          },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Track rule adherence as your headline stat — the percentage of decisions that followed your process. Outcomes wobble with market noise; adherence is fully under your control and, over months, it's what your equity curve ends up reflecting. A monthly review then zooms out: are the weekly leaks repeating? Is the process itself due an upgrade?",
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "Reviewing skipped trades is as important as reviewing taken ones. Your skips reveal whether the decision engine is calibrated — good skips are evidence your discipline is real.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "callout-tip",
          type: "callout",
          content:
            "Use the Trade Journal in this app for daily entries and the Performance page for your weekly numbers — the review habit is built into the platform.",
          metadata: { variant: "tip" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Weekly: audit every take and every skip against your rules, extract one improvement, and track rule adherence as the headline stat. The stats never end — that's the profession.",
        },
      ],
    },
    {
      id: "pf-m5-professional-mindset",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "thinking-like-a-professional-trader",
      title: "Thinking Like a Professional Trader",
      description: "Confidence through repetition, discipline through rules.",
      lessonType: "reading",
      difficulty: "advanced",
      order: 6,
      xpReward: 65,
      prerequisites: ["pf-m5-weekly-review"],
      estimatedMinutes: 0,
      reflectionPrompt:
        "Which single rule from this track will be hardest for YOU personally to follow — and what will you do the first time you're tempted to break it?",
      contentBlocks: [
        { id: "h1", type: "heading", content: "Thinking Like a Professional Trader" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "You now own the full system: context, positioning, selection, watchlists, routine, risk, review. The final component isn't technical — it's how professionals think about the job itself. Their edge over time isn't a secret setup. It's a relationship with process that most people never build.",
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Confidence comes from repetition, not from wins. A trader who has run the same routine five hundred times trusts it in a way no winning streak can produce — and that trust is what holds under pressure. Fear, meanwhile, is conquered through rules: you cannot eliminate fear, but a decision that's already been made by a rule leaves fear nothing to grab.",
        },
        {
          id: "check1",
          type: "checklist",
          content: "The professional mental framework:",
          metadata: {
            items: [
              "Think in years, not days — one trade means almost nothing",
              "Trust the process, especially during losing streaks",
              "Challenge yourself on skills, not on position size",
              "Let daily discipline compound — it's the only compounding you control",
              "Build confidence through repetition, not through outcomes",
            ],
          },
        },
        {
          id: "callout-key",
          type: "callout",
          content:
            "Financial independence — if it comes — is built through consistency, not gambling. The traders who last treat trading as a craft practised daily, not a lottery ticket scratched nightly.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "callout-mistake",
          type: "callout",
          content:
            "Judging yourself by this week's P&L. Randomness dominates short windows. The professional's scoreboard is rule adherence and decision quality — the outcomes follow on their own schedule, or they don't, but the process is the only lever you hold.",
          metadata: { variant: "mistake" },
        },
        {
          id: "safety",
          type: "safety-note",
          content:
            "Educational simulator only. Not financial advice. Most retail traders lose money; a professional process improves decision quality but guarantees nothing.",
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Repetition builds confidence, rules defeat fear, and consistency — not gambling — is the only route worth walking. You have the operating system; run it every day.",
        },
      ],
    },
    {
      id: "pf-m5-final-assessment",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "professional-forex-workflow-assessment",
      title: "Professional Forex Workflow Assessment",
      description:
        "The final milestone: prove you can run the complete professional workflow.",
      lessonType: "quiz",
      difficulty: "advanced",
      order: 7,
      xpReward: 100,
      prerequisites: ["pf-m5-professional-mindset"],
      estimatedMinutes: 0,
      quizId: "professional-forex-workflow-assessment",
      contentBlocks: [],
    },
  ],
}
