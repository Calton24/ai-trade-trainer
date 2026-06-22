import type { LearningPathContent } from "@/lib/course/types"

const PATH_ID = "price-action"

export const priceActionPath: LearningPathContent = {
  id: PATH_ID,
  slug: PATH_ID,
  title: "Price Action Fundamentals",
  description:
    "Learn to read the chart itself — mark support and resistance, tell breakouts from fakeouts, and trade the classic break-and-retest. Every lesson ends with a chart you mark yourself.",
  level: "beginner",
  category: "price-action",
  order: 2,
  isFree: true,
  status: "available",
  locked: false,
  skillsYouGain: [
    "Mark support and resistance levels",
    "Tell a real breakout from a fakeout",
    "Spot break-and-retest entries",
    "Read levels straight off the chart",
  ],
  whatYouLearn: [
    "What support and resistance really are",
    "Why levels break — and why breaks fail",
    "How old resistance becomes new support",
    "Marking levels yourself on practice charts",
  ],
  relatedPathSlugs: ["trading-foundations", "icc-strategy"],
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
      id: "pa-m1",
      pathId: PATH_ID,
      title: "Support & Resistance",
      description:
        "Find the price floors and ceilings the market keeps reacting to — and learn to draw them yourself.",
      order: 1,
      estimatedMinutes: 0,
      lessons: [
        {
          id: "pa-m1-support-resistance",
          moduleId: "pa-m1",
          pathId: PATH_ID,
          slug: "support-and-resistance",
          title: "Support and Resistance",
          description: "The floors and ceilings price keeps respecting.",
          lessonType: "reading",
          difficulty: "beginner",
          order: 1,
          xpReward: 50,
          prerequisites: [],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "Support and Resistance",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "Support and resistance are the most important levels on any chart. Support is a price area where buyers have repeatedly stepped in to stop a fall. Resistance is a price area where sellers have repeatedly stepped in to cap a rally.",
            },
            {
              id: "def-support",
              type: "definition",
              content:
                "A price area where buying pressure has repeatedly halted a decline — a floor.",
              metadata: { term: "Support" },
            },
            {
              id: "def-resistance",
              type: "definition",
              content:
                "A price area where selling pressure has repeatedly capped a rally — a ceiling.",
              metadata: { term: "Resistance" },
            },
            {
              id: "callout-key",
              type: "callout",
              content:
                "Levels are zones, not exact prices. Look for the area where the wicks cluster, not a single perfect line.",
              metadata: { variant: "key-idea" },
            },
            {
              id: "demo-support",
              type: "chart-demo",
              scenarioId: "demo-support",
              content:
                "Notice how price keeps bouncing from the same floor. That repeated reaction is what makes it support.",
            },
            {
              id: "demo-resistance",
              type: "chart-demo",
              scenarioId: "demo-resistance",
              content:
                "Here price keeps getting rejected from the same ceiling. Sellers defend it each time.",
            },
            {
              id: "callout-mistake",
              type: "callout",
              content:
                "Drawing a level off a single touch. The more clean reactions a level has, the more it matters.",
              metadata: { variant: "mistake" },
            },
            {
              id: "lab-support",
              type: "interactive-chart-question",
              scenarioId: "task-identify-support",
              content:
                "Your turn — draw the support level price keeps bouncing from.",
            },
            {
              id: "sum1",
              type: "summary",
              content:
                "Support is the floor, resistance is the ceiling. The market reacts at these levels again and again — your job is to mark them before they're tested.",
            },
          ],
        },
        {
          id: "pa-m1-draw-resistance",
          moduleId: "pa-m1",
          pathId: PATH_ID,
          slug: "draw-resistance",
          title: "Draw the Resistance",
          description: "Practice marking a ceiling sellers defend.",
          lessonType: "interactive",
          difficulty: "beginner",
          order: 2,
          xpReward: 45,
          prerequisites: ["pa-m1-support-resistance"],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "Draw the Resistance",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "The fastest way to learn levels is to draw them. On the chart below, find where the highs line up and mark the resistance the market keeps rejecting from.",
            },
            {
              id: "lab-resistance",
              type: "interactive-chart-question",
              scenarioId: "task-identify-resistance",
              content: "Mark the resistance level the highs share.",
            },
            {
              id: "callout-key",
              type: "callout",
              content:
                "When old resistance finally breaks, it often flips into support. Keep your levels on the chart even after a break.",
              metadata: { variant: "key-idea" },
            },
            {
              id: "sum1",
              type: "summary",
              content:
                "Drawing levels yourself trains your eye far faster than just reading about them.",
            },
          ],
        },
        {
          id: "pa-m1-quiz-levels",
          moduleId: "pa-m1",
          pathId: PATH_ID,
          slug: "levels-check",
          title: "Levels Check",
          description: "Quick quiz on support, resistance, and how to draw them.",
          lessonType: "quiz",
          difficulty: "beginner",
          order: 3,
          xpReward: 50,
          prerequisites: ["pa-m1-draw-resistance"],
          quizId: "price-action-levels-check",
          estimatedMinutes: 0,
          contentBlocks: [],
        },
      ],
    },
    {
      id: "pa-m2",
      pathId: PATH_ID,
      title: "Breakouts vs Fakeouts",
      description:
        "Not every break is real. Learn to tell a genuine breakout from a trap that snaps back.",
      order: 2,
      estimatedMinutes: 0,
      lessons: [
        {
          id: "pa-m2-breakouts",
          moduleId: "pa-m2",
          pathId: PATH_ID,
          slug: "breakouts",
          title: "Breakouts",
          description: "When price closes decisively through a level.",
          lessonType: "reading",
          difficulty: "beginner",
          order: 1,
          xpReward: 50,
          prerequisites: ["pa-m1-quiz-levels"],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "Breakouts",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "A breakout happens when price closes beyond a level it previously respected. The key word is closes — a candle that pokes through with a wick but closes back inside has not broken anything.",
            },
            {
              id: "def-breakout",
              type: "definition",
              content:
                "Price closing decisively beyond a support or resistance level, often on a larger candle.",
              metadata: { term: "Breakout" },
            },
            {
              id: "callout-key",
              type: "callout",
              content:
                "Judge breakouts by the close, not the wick. A strong close beyond the level is the signal.",
              metadata: { variant: "key-idea" },
            },
            {
              id: "demo-breakout",
              type: "chart-demo",
              scenarioId: "demo-breakout",
              content:
                "Watch the candle that closes above resistance and keeps going. That's a breakout.",
            },
            {
              id: "lab-breakout",
              type: "interactive-chart-question",
              scenarioId: "task-mark-breakout",
              content:
                "Mark the resistance, then mark the candle that breaks above it.",
            },
            {
              id: "sum1",
              type: "summary",
              content:
                "A real breakout closes beyond the level and often accelerates. Wicks through a level are not breakouts.",
            },
          ],
        },
        {
          id: "pa-m2-fakeouts",
          moduleId: "pa-m2",
          pathId: PATH_ID,
          slug: "fakeouts",
          title: "Fakeouts",
          description: "Breaks that fail and trap traders who chased.",
          lessonType: "reading",
          difficulty: "beginner",
          order: 2,
          xpReward: 50,
          prerequisites: ["pa-m2-breakouts"],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "Fakeouts",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "A fakeout spikes past a level then closes back inside it. Traders who bought the 'breakout' get trapped as price reverses. Fakeouts are common right at obvious levels where lots of traders are watching.",
            },
            {
              id: "def-fakeout",
              type: "definition",
              content:
                "A break that fails — price pierces a level with a wick but closes back inside it.",
              metadata: { term: "Fakeout (false break)" },
            },
            {
              id: "callout-mistake",
              type: "callout",
              content:
                "Chasing the first candle that touches beyond a level. Wait for the close to confirm before deciding it's a real break.",
              metadata: { variant: "mistake" },
            },
            {
              id: "demo-fakeout",
              type: "chart-demo",
              scenarioId: "demo-fakeout",
              content:
                "See how the spike above resistance closed back below it? That trapped the breakout buyers.",
            },
            {
              id: "sum1",
              type: "summary",
              content:
                "Breakout vs fakeout comes down to the close. Patience at the level is what separates the two.",
            },
          ],
        },
      ],
    },
    {
      id: "pa-m3",
      pathId: PATH_ID,
      title: "Break & Retest",
      description:
        "The classic price-action entry: price breaks a level, comes back to test it, then continues.",
      order: 3,
      estimatedMinutes: 0,
      lessons: [
        {
          id: "pa-m3-break-retest",
          moduleId: "pa-m3",
          pathId: PATH_ID,
          slug: "break-and-retest",
          title: "Break and Retest",
          description: "Old resistance becomes new support.",
          lessonType: "reading",
          difficulty: "beginner",
          order: 1,
          xpReward: 55,
          prerequisites: ["pa-m2-fakeouts"],
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "h1",
              type: "heading",
              content: "Break and Retest",
            },
            {
              id: "p1",
              type: "paragraph",
              content:
                "After price breaks a level, it often returns to test it from the other side before continuing. Broken resistance can act as new support, and broken support can act as new resistance. This retest is one of the cleanest beginner entries.",
            },
            {
              id: "def-retest",
              type: "definition",
              content:
                "When price returns to a broken level and reacts off it from the opposite side before continuing.",
              metadata: { term: "Retest" },
            },
            {
              id: "callout-key",
              type: "callout",
              content:
                "The retest gives you a defined risk: enter near the level, stop just on the other side of it.",
              metadata: { variant: "key-idea" },
            },
            {
              id: "demo-break-retest",
              type: "chart-demo",
              scenarioId: "demo-break-retest",
              content:
                "Price breaks the level, pulls back to tap it as support, then continues. That tap is the retest.",
            },
            {
              id: "lab-break-retest",
              type: "interactive-chart-question",
              scenarioId: "task-break-retest",
              content:
                "Mark the level, the break, and the retest where old resistance became support.",
            },
            {
              id: "sum1",
              type: "summary",
              content:
                "Break and retest turns a level into a trade idea: wait for the break, wait for the retest, then look for continuation.",
            },
          ],
        },
        {
          id: "pa-m3-reflection",
          moduleId: "pa-m3",
          pathId: PATH_ID,
          slug: "your-level-rules",
          title: "Build Your Level Rules",
          description:
            "Turn what you learned about levels into personal price-action rules.",
          lessonType: "reflection",
          difficulty: "beginner",
          order: 2,
          xpReward: 50,
          prerequisites: ["pa-m3-break-retest"],
          reflectionPrompt:
            "Write 3 rules for trading levels. Examples: 'I only mark levels with at least two clean reactions', 'I wait for a candle to close beyond a level before calling it a breakout', 'I prefer break-and-retest entries because my risk is defined.'",
          estimatedMinutes: 0,
          contentBlocks: [
            {
              id: "p1",
              type: "paragraph",
              content:
                "You can now mark support and resistance, tell breakouts from fakeouts, and spot a break-and-retest. Lock it in by writing your own rules — this reflection saves to your practice journal.",
            },
            {
              id: "callout-key",
              type: "callout",
              content:
                "Clear rules stop you from chasing every wick. Decide in advance what a valid level and a valid break look like to you.",
              metadata: { variant: "key-idea" },
            },
          ],
        },
      ],
    },
  ],
}
