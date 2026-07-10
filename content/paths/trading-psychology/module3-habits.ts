import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "trading-psychology"
const MODULE_ID = "tp-m3"

/** Module 3 — Habits & Routines: daily structure, journaling, review, and recovery. */
export const habitsModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Habits & Routines",
  description:
    "Discipline isn't a personality trait — it's a routine you build: preparation, journaling, review, sleep, and recovery.",
  order: 3,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "tp-m3-routine",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "the-power-of-routine",
      title: "The Power of Routine",
      description: "Structure removes decisions — and removed decisions can't be emotional.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 1,
      xpReward: 50,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Discipline Is a System, Not a Trait" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Nobody has infinite willpower at the screen. Traders who look disciplined have simply moved their decisions OUT of the emotional moment: the routine decides when to check the calendar, when analysis happens, what qualifies a trade, and when the day ends. By the time emotions arrive, everything important is already decided.",
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "A trading routine has three parts. Before: calendar, context, watchlist, mental check-in. During: execute only what the plan allows, journal entries as they happen. After: review the day's decisions, grade adherence (not P&L), screenshot key charts, close the platform at a defined time.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "order-steps",
            prompt: "Arrange a professional trading day in order.",
            steps: [
              "Check sleep, stress, and readiness — decide IF you should trade today",
              "Review the economic calendar for red events",
              "Analyse context and build the day's watchlist",
              "Execute only setups the plan qualifies — or nothing",
              "Journal each trade and each meaningful skip as it happens",
              "End-of-day review: grade adherence, screenshot charts, shut down",
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "The first step — deciding IF you should trade — is the one beginners skip. Trading tired, stressed, or distracted has the same expected value as trading drunk.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Routines pre-make your decisions while you're calm. Before, during, after — the same sequence every day, whether the day made or lost money.",
        },
      ],
    },
    {
      id: "tp-m3-journaling",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "journaling-that-works",
      title: "Journaling That Works",
      description: "The feedback loop that turns experience into skill.",
      lessonType: "reading",
      difficulty: "intermediate",
      order: 2,
      xpReward: 45,
      prerequisites: ["tp-m3-routine"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Experience Isn't Enough" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Ten years of trading without review is one year of mistakes repeated ten times. The journal is what converts screen time into skill: it captures what you saw, what you did, WHY you did it, and how you felt — so patterns invisible in the moment become obvious in review.",
        },
        {
          id: "checklist1",
          type: "checklist",
          content: "A useful journal entry records:",
          metadata: {
            items: [
              "The setup and why it qualified (or why you skipped)",
              "Entry, stop, target, and size — with the risk math",
              "Emotional state before, during, and after",
              "Any rule broken or followed under pressure",
              "A grade for the DECISION (A/B/C), independent of outcome",
              "A screenshot of the chart at entry",
            ],
          },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Journal skips too. 'Saw the setup, skipped because news in 20 minutes' is a data point about your discipline. Over months, your skip log reveals whether your filters add value — and your emotion column reveals which states precede your worst trades.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "After 60 journal entries, a trader notices: every C-grade decision happened after 2pm, following a morning loss, on trades entered within 5 minutes of 'feeling behind'. That single pattern — invisible day to day — was worth more than any indicator.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "The journal's job isn't recording history — it's catching YOUR specific failure pattern before it gets expensive.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Journal every trade and meaningful skip: setup, risk, emotion, grade. Review weekly. The patterns are where the growth lives.",
        },
      ],
    },
    {
      id: "tp-m3-body",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "sleep-stress-and-state",
      title: "Sleep, Stress & State",
      description: "Your nervous system is trading infrastructure. Maintain it.",
      lessonType: "reading",
      difficulty: "intermediate",
      order: 3,
      xpReward: 40,
      prerequisites: ["tp-m3-journaling"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Hardware Under the Strategy" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Every trading decision runs on biological hardware. Sleep deprivation measurably degrades risk judgment — studies consistently show sleep-deprived people take LARGER risks while feeling MORE confident. Stress narrows attention and shortens time horizons: exactly the state that turns a planned 2R hold into a panicked exit.",
        },
        {
          id: "checklist1",
          type: "checklist",
          content: "The pre-trading state check (60 seconds):",
          metadata: {
            items: [
              "Did I sleep reasonably? (Under ~6 hours: reduce size or skip the day)",
              "Is anything urgent bleeding attention — argument, deadline, bill?",
              "Am I trading to execute a plan, or to feel something (excitement, recovery)?",
              "One honest answer: would I bet on THIS version of me today?",
            ],
          },
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Exercise and breaks aren't lifestyle advice here — they're performance tools. A walk after a loss resets the nervous system faster than staring at the chart that caused it. Movement metabolises the stress hormones that would otherwise make the next decision for you.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "The market will be there tomorrow. A degraded state trading a perfect setup still produces a bad trade — the trader is part of the system.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Sleep, stress, and state are risk parameters. Check them daily before the charts — and be willing to grade yourself out of the day.",
        },
      ],
    },
    {
      id: "tp-m3-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "habits-check",
      title: "Habits Check",
      description: "Test routine, journaling, and state management.",
      lessonType: "quiz",
      difficulty: "intermediate",
      order: 4,
      xpReward: 50,
      prerequisites: ["tp-m3-body"],
      estimatedMinutes: 0,
      quizId: "habits-check",
      contentBlocks: [],
    },
  ],
}
