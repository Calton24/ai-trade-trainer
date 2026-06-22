import type { LearningPathContent } from "@/lib/course/types"

const PATH_ID = "icc-strategy"

export const iccStrategyPath: LearningPathContent = {
  id: PATH_ID,
  slug: PATH_ID,
  title: "ICC Strategy Path",
  description:
    "Read the market in three phases — Indication, Correction, Continuation. You'll see each phase on generated charts, then mark the entry, stop, and target yourself.",
  level: "intermediate",
  category: "icc",
  order: 4,
  isFree: true,
  status: "available",
  locked: false,
  skillsYouGain: [
    "Spot the indication push that signals direction",
    "Wait for the correction instead of chasing",
    "Time a continuation entry from the zone",
    "Place entry, stop, and target on a real setup",
  ],
  whatYouLearn: [
    "What each ICC phase looks like on a chart",
    "Why patience in the correction is the edge",
    "How to confirm a continuation before entering",
    "Marking a full ICC setup yourself",
  ],
  relatedPathSlugs: ["price-action", "trading-foundations"],
  estimatedMinutes: 0,
  stats: {
    moduleCount: 0,
    lessonCount: 0,
    quizCount: 0,
    drillCount: 0,
    reflectionCount: 0,
  },
  modules: [
    {
      id: "icc-m1",
      pathId: PATH_ID,
      title: "The ICC Framework",
      description:
        "Break the market into three readable phases and learn to recognise each one on the chart.",
      order: 1,
      estimatedMinutes: 0,
      lessons: [
        {
          id: "icc-m1-indication",
          moduleId: "icc-m1",
          pathId: PATH_ID,
          slug: "indication",
          title: "Indication: Spotting the Market Push",
          description: "The strong, decisive move that signals direction.",
          lessonType: "reading",
          difficulty: "intermediate",
          order: 1,
          xpReward: 55,
          prerequisites: [],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "Indication: Spotting the Market Push",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "ICC stands for Indication, Correction, Continuation. It's a simple way to read intent on a chart. The first phase, the indication, is a strong and decisive push in one direction. It tells you where the larger players are pressing.",
            },
            {
              id: "def-ind",
              type: "definition",
              content:
                "The first strong, decisive push in a direction — large candle bodies with little hesitation — that signals where the market wants to go.",
              metadata: { term: "Indication" },
            },
            {
              id: "callout-key",
              type: "callout",
              content:
                "You don't enter on the indication. It's the clue, not the trade. You note the direction and wait for the next two phases.",
              metadata: { variant: "key-idea" },
            },
            {
              id: "demo-ind",
              type: "chart-demo",
              scenarioId: "demo-icc-indication",
              content:
                "This first leg is the indication — strong and decisive. That's your signal of direction.",
            },
            {
              id: "callout-mistake",
              type: "callout",
              content:
                "Chasing the indication. By the time the push is obvious, the easy entry has passed. Patience for the correction is the whole point.",
              metadata: { variant: "mistake" },
            },
            {
              id: "sum1",
              type: "summary",
              content:
                "The indication is the strongest leg on the chart — it reveals direction. Mark it, then wait.",
            },
          ],
        },
        {
          id: "icc-m1-correction",
          moduleId: "icc-m1",
          pathId: PATH_ID,
          slug: "correction",
          title: "Correction: Waiting for the Pullback",
          description: "The pullback that builds your entry zone.",
          lessonType: "reading",
          difficulty: "intermediate",
          order: 2,
          xpReward: 55,
          prerequisites: ["icc-m1-indication"],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "Correction: Waiting for the Pullback",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "After the indication, price drifts back the other way. This is the correction. It usually moves slower and on smaller candles than the push that came before it. The correction builds the zone where you'll look for your entry.",
            },
            {
              id: "def-corr",
              type: "definition",
              content:
                "A pullback against the indication, on smaller candles, that forms the discount/premium zone where the next entry is likely to appear.",
              metadata: { term: "Correction" },
            },
            {
              id: "callout-key",
              type: "callout",
              content:
                "A healthy correction is shallow and slow. If price reverses hard and fast, the indication may have been wrong.",
              metadata: { variant: "key-idea" },
            },
            {
              id: "demo-corr",
              type: "chart-demo",
              scenarioId: "demo-icc-correction",
              content:
                "After the push, price pulls back into the shaded zone. That zone is where you watch for a continuation.",
            },
            {
              id: "sum1",
              type: "summary",
              content:
                "The correction is the patience phase. It builds the zone you'll trade from — your job is to wait for it, not fight it.",
            },
          ],
        },
        {
          id: "icc-m1-continuation",
          moduleId: "icc-m1",
          pathId: PATH_ID,
          slug: "continuation",
          title: "Continuation: Confirming the Entry Zone",
          description: "Enter when price resumes the original push.",
          lessonType: "interactive",
          difficulty: "intermediate",
          order: 3,
          xpReward: 65,
          prerequisites: ["icc-m1-correction"],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "Continuation: Confirming the Entry Zone",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "The continuation is the payoff. When price reacts out of the correction zone in the direction of the indication, that reaction is your entry trigger. You enter in the zone, place your stop just beyond it, and target the prior high.",
            },
            {
              id: "callout-key",
              type: "callout",
              content:
                "Entry in the zone, stop below the zone, target beyond the prior high. Define all three before you commit.",
              metadata: { variant: "key-idea" },
            },
            {
              id: "demo-cont",
              type: "chart-demo",
              scenarioId: "demo-icc-continuation",
              content:
                "Price leaves the correction zone in the push direction — that reaction is the continuation entry.",
            },
            {
              id: "lab-cont",
              type: "interactive-chart-question",
              scenarioId: "task-icc-bullish",
              content:
                "Your turn — after the bullish indication and correction, place your entry in the zone, a stop below it, and a take-profit beyond the prior high.",
            },
            {
              id: "callout-mistake",
              type: "callout",
              content:
                "If price breaks straight through the zone instead of reacting from it, the continuation never confirmed. No reaction, no trade.",
              metadata: { variant: "mistake" },
            },
            {
              id: "sum1",
              type: "summary",
              content:
                "Continuation confirms the setup: a reaction out of the zone in the push direction. Entry, stop, and target are all defined by the structure.",
            },
          ],
        },
      ],
    },
    {
      id: "icc-m2",
      pathId: PATH_ID,
      title: "Trading the Full Setup",
      description:
        "Put all three phases together, prove it on the chart, and write your own ICC rules.",
      order: 2,
      estimatedMinutes: 0,
      lessons: [
        {
          id: "icc-m2-full-practice",
          moduleId: "icc-m2",
          pathId: PATH_ID,
          slug: "full-setup-practice",
          title: "ICC Full Setup Practice",
          description: "Apply indication, correction, and continuation to a short setup.",
          lessonType: "interactive",
          difficulty: "intermediate",
          order: 1,
          xpReward: 70,
          prerequisites: ["icc-m1-continuation"],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "ICC Full Setup Practice",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "ICC works in both directions. Here the indication pushes down, price corrects upward into a zone, and you look for a short continuation. Mark the entry, stop, and target on this bearish setup.",
            },
            {
              id: "lab-bear",
              type: "interactive-chart-question",
              scenarioId: "task-icc-bearish",
              content:
                "After the bearish indication and correction, place a short entry in the zone, a stop above it, and a take-profit beyond the prior low.",
            },
            {
              id: "callout-key",
              type: "callout",
              content:
                "Same framework, mirrored: for shorts the stop sits above the zone and the target sits below the prior low.",
              metadata: { variant: "key-idea" },
            },
            {
              id: "safety",
              type: "safety-note",
              content:
                "Educational simulation only. Not financial advice or a trade recommendation. Charts are generated for practice.",
            },
            {
              id: "sum1",
              type: "summary",
              content:
                "You can now read all three ICC phases and mark a full setup in either direction.",
            },
          ],
        },
        {
          id: "icc-m2-quiz",
          moduleId: "icc-m2",
          pathId: PATH_ID,
          slug: "icc-check",
          title: "ICC Framework Check",
          description: "Quick quiz on indication, correction, and continuation.",
          lessonType: "quiz",
          difficulty: "intermediate",
          order: 2,
          xpReward: 60,
          prerequisites: ["icc-m2-full-practice"],
          quizId: "icc-framework-check",
          estimatedMinutes: 0,
          contentBlocks: [],
        },
        {
          id: "icc-m2-reflection",
          moduleId: "icc-m2",
          pathId: PATH_ID,
          slug: "your-icc-rules",
          title: "Build Your ICC Rules",
          description: "Turn the framework into your own checklist.",
          lessonType: "reflection",
          difficulty: "intermediate",
          order: 3,
          xpReward: 55,
          prerequisites: ["icc-m2-quiz"],
          reflectionPrompt:
            "Write your own ICC checklist. Examples: 'I only trade a continuation after a clear indication and a controlled correction', 'My stop always sits just beyond the correction zone', 'If price breaks through the zone, I stand aside.'",
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "p1",
              type: "paragraph",
              content:
                "You can now read indication, correction, and continuation, and mark a full setup. Lock it in by writing your own rules — this reflection saves to your practice journal.",
            },
            {
              id: "callout-key",
              type: "callout",
              content:
                "A written checklist keeps you patient. Decide in advance what a valid indication, correction, and continuation look like to you.",
              metadata: { variant: "key-idea" },
            },
          ],
        },
      ],
    },
  ],
}
