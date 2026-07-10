import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "trading-psychology"
const MODULE_ID = "tp-m4"

/** Module 4 — The Professional Mindset: long-term thinking, consistency, compounding skill. */
export const professionalMindsetModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "The Professional Mindset",
  description:
    "Long-term expectancy, consistency over excitement, compounding skill, and the patience professionals are actually paid for.",
  order: 4,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "tp-m4-long-term",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "the-long-game",
      title: "The Long Game",
      description: "Traders who survive decades think in years, not sessions.",
      lessonType: "reading",
      difficulty: "intermediate",
      order: 1,
      xpReward: 45,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "A Business, Not a Lottery" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Amateurs ask 'how much can I make this week?' Professionals ask 'what's my expectancy per trade, and how many quality trades does a year contain?' The first question leads to forcing, oversizing, and blown accounts. The second leads to a business: known costs (losses), known revenue drivers (edge × repetitions), and a growth curve measured in quarters.",
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "This reframe transforms daily experience. A losing day stops being a crisis — it's a business expense, as unremarkable as a restaurant paying for ingredients. A winning day stops being a triumph — it's revenue, expected and budgeted. The emotional temperature of trading drops to something sustainable for decades.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "A trader with +0.3R expectancy taking 300 quality trades a year earns ~90R annually. At 1% risk that's roughly 90% cumulative growth (after all losses) — from a system that loses 55% of the time and never has an exciting day.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Consistency beats excitement. The boring trader compounding 1% edges outperforms the thrilling trader alternating +20% and −30% months — every time, mathematically.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Think in annual samples and business terms. Losses are expenses, edge is the product, and the goal is to still be operating in year ten.",
        },
      ],
    },
    {
      id: "tp-m4-compounding-skill",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "compounding-skill",
      title: "Compounding Skill",
      description: "Small daily improvements are the real leverage.",
      lessonType: "reading",
      difficulty: "intermediate",
      order: 2,
      xpReward: 45,
      prerequisites: ["tp-m4-long-term"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Skill Curve Is the Equity Curve" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Before money compounds, skill must. Every properly journaled trade, every honest review, every drilled setup adds a small increment to your pattern recognition and discipline. Like financial compounding, the curve is invisible for months and undeniable after years — and like financial compounding, it only works uninterrupted.",
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Delayed gratification is the mechanism. Small position sizes while learning FEEL like wasted time — the wins are tiny. But the skills built at 0.5% risk are identical to those needed at full size, and the mistakes cost pennies instead of accounts. Traders who 'skip ahead' to real size pay full price for an education they could have had at a discount.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Year one: tiny size, 400 journaled trades, endless review — account roughly flat. Year two: same system, same size rules — up 22%, because the trader operating the system is no longer the same person. The flat year WAS the investment.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Patience in trading isn't waiting for setups — it's accepting that competence itself has a timeline no shortcut compresses.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Skill compounds before money does. Protect the streak of deliberate practice like professionals protect capital — it's the same asset, earlier in the pipeline.",
        },
      ],
    },
    {
      id: "tp-m4-reflection",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "mindset-reflection",
      title: "Mindset Reflection",
      description: "Write your own trading principles — the Dalio exercise.",
      lessonType: "reflection",
      difficulty: "intermediate",
      order: 3,
      xpReward: 50,
      prerequisites: ["tp-m4-compounding-skill"],
      estimatedMinutes: 0,
      reflectionPrompt:
        "Write three personal trading principles — rules about how YOU will behave, based on what you've learned about probabilities, emotions, and habits. For each: the principle, the failure it prevents, and how you'll know you're following it. Example: 'I never trade in the first 30 minutes after a loss — this prevents revenge trading — my journal will show a timestamp gap after every red trade.'",
      contentBlocks: [
        { id: "h1", type: "heading", content: "Principles Are Pre-Made Decisions" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Ray Dalio built his firm on written principles: explicit if-this-then-that rules distilled from every mistake. The act of WRITING them matters — vague intentions ('I'll be more disciplined') don't survive contact with a live chart; written principles ('after two losses I stop for the day') do.",
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Good principles come from YOUR failure patterns, not generic advice. Review your journal: where do you actually leak money? Late-day boredom trades? Post-loss urgency? Oversizing after wins? Each pattern becomes a principle: specific, checkable, and written before you need it.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Pain + reflection = progress. A mistake journaled and turned into a principle was tuition; the same mistake repeated is just loss.",
          metadata: { variant: "key-idea" },
        },
      ],
    },
    {
      id: "tp-m4-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "professional-mindset-check",
      title: "Professional Mindset Check",
      description: "Test long-term thinking and skill compounding.",
      lessonType: "quiz",
      difficulty: "intermediate",
      order: 4,
      xpReward: 50,
      prerequisites: ["tp-m4-reflection"],
      estimatedMinutes: 0,
      quizId: "professional-mindset-check",
      contentBlocks: [],
    },
  ],
}
