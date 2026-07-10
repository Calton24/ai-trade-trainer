import type { CourseModule } from "@/lib/course/types"
import type { SwingPoint } from "@/lib/course/widgets"

const PATH_ID = "market-structure-mastery"
const MODULE_ID = "ms-m1"

/** Reusable swing sequences (0–100 grid, y: higher = higher price). */
const BULLISH: SwingPoint[] = [
  { x: 8, y: 30, type: "low", label: "HL" },
  { x: 22, y: 50, type: "high", label: "HH" },
  { x: 36, y: 40, type: "low", label: "HL" },
  { x: 52, y: 66, type: "high", label: "HH" },
  { x: 68, y: 56, type: "low", label: "HL" },
  { x: 84, y: 82, type: "high", label: "HH" },
]

const BEARISH: SwingPoint[] = [
  { x: 8, y: 78, type: "high", label: "LH" },
  { x: 22, y: 54, type: "low", label: "LL" },
  { x: 36, y: 66, type: "high", label: "LH" },
  { x: 52, y: 38, type: "low", label: "LL" },
  { x: 68, y: 50, type: "high", label: "LH" },
  { x: 84, y: 22, type: "low", label: "LL" },
]

/** Uptrend that prints a lower low at the end — an early reversal warning. */
const EARLY_REVERSAL: SwingPoint[] = [
  { x: 8, y: 30, type: "low", label: "HL" },
  { x: 22, y: 52, type: "high", label: "HH" },
  { x: 38, y: 42, type: "low", label: "HL" },
  { x: 54, y: 64, type: "high", label: "HH" },
  { x: 72, y: 34, type: "low", label: "LL" },
]

/** Downtrend that finally prints a higher high — reversal beginning. */
const DOWN_TO_REVERSAL: SwingPoint[] = [
  { x: 8, y: 76, type: "high", label: "LH" },
  { x: 22, y: 52, type: "low", label: "LL" },
  { x: 38, y: 64, type: "high", label: "LH" },
  { x: 54, y: 40, type: "low", label: "LL" },
  { x: 72, y: 72, type: "high", label: "HH" },
]

/** Rangebound: highs and lows roughly equal. */
const RANGE: SwingPoint[] = [
  { x: 8, y: 42, type: "low", label: "HL" },
  { x: 24, y: 64, type: "high", label: "LH" },
  { x: 42, y: 40, type: "low", label: "LL" },
  { x: 60, y: 66, type: "high", label: "HH" },
  { x: 78, y: 43, type: "low", label: "HL" },
]

/** Clean uptrend at a shallow pullback — Phase 2, prepare to trade the resumption. */
const PHASE2_PULLBACK: SwingPoint[] = [
  { x: 10, y: 32, type: "low", label: "HL" },
  { x: 26, y: 56, type: "high", label: "HH" },
  { x: 44, y: 46, type: "low", label: "HL" },
  { x: 62, y: 74, type: "high", label: "HH" },
  { x: 82, y: 62, type: "low", label: "HL" },
]

/**
 * Module — Market Structure Mastery. One interactive module teaching the
 * complete structure-reading skill: HH/HL/LH/LL, the four-point rule, trend
 * detection, continuation vs reversal, phases, and trade/wait/skip.
 */
export const marketStructureModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Market Structure Mastery",
  description:
    "Read structure like a professional: label swings, spot the four points, classify the trend, and decide continuation vs reversal.",
  order: 1,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "ms-what-is-structure",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "what-is-market-structure",
      title: "What Is Market Structure?",
      description: "Every trend is built from swing highs and swing lows.",
      lessonType: "reading",
      difficulty: "beginner",
      order: 1,
      xpReward: 40,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Markets Leave Clues" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Price never moves in a straight line. It pushes, pauses, pulls back, and pushes again — leaving behind a trail of peaks (swing highs) and valleys (swing lows). Reading the relationship between these swings is called market structure, and it's the single most transferable skill in trading. Every strategy you'll ever learn sits on top of it.",
        },
        {
          id: "def1",
          type: "definition",
          content:
            "The pattern formed by consecutive swing highs and swing lows. It tells you the direction and health of a trend before any indicator does.",
          metadata: { term: "Market structure" },
        },
        {
          id: "def2",
          type: "definition",
          content: "A peak — a candle higher than the candles on either side. Price turned down here.",
          metadata: { term: "Swing high" },
        },
        {
          id: "def3",
          type: "definition",
          content: "A valley — a candle lower than the candles on either side. Price turned up here.",
          metadata: { term: "Swing low" },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Four labels describe every trend: Higher High (HH), Higher Low (HL), Lower High (LH), Lower Low (LL). Master these four and you can read any chart on any timeframe.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Structure is the pattern of swing highs and lows. HH, HL, LH, LL are the four building blocks — everything else in this module builds on them.",
        },
      ],
    },
    {
      id: "ms-bullish-structure",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "higher-highs-and-higher-lows",
      title: "Higher Highs & Higher Lows",
      description: "The signature of a bullish trend — label it yourself.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 2,
      xpReward: 50,
      prerequisites: ["ms-what-is-structure"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Up Is a Staircase" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "A bullish trend is a staircase going up: each peak is higher than the last (Higher High), and each pullback bottoms out higher than the last (Higher Low). As long as price keeps printing HH and HL, buyers are in control — the trend is intact.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "swing-labeler",
            prompt:
              "Trend Detective: label each numbered swing, then classify the trend.",
            points: BULLISH,
            trend: "Uptrend",
            trendExplain:
              "Every peak is a Higher High and every trough a Higher Low — a textbook uptrend. Buyers keep stepping in earlier each time.",
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "The Higher Low is the important one. As long as pullbacks keep making higher lows, the uptrend is healthy. The first LOWER low is your first warning.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Uptrend = Higher Highs + Higher Lows. Watch the higher lows — they confirm buyers are still in control.",
        },
      ],
    },
    {
      id: "ms-bearish-structure",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "lower-highs-and-lower-lows",
      title: "Lower Highs & Lower Lows",
      description: "The signature of a bearish trend.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 3,
      xpReward: 50,
      prerequisites: ["ms-bullish-structure"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Down Is a Staircase Too" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "A bearish trend is the mirror image: each peak is lower than the last (Lower High) and each trough is lower than the last (Lower Low). Sellers are in control. The first HIGHER high is the first sign that control may be changing hands.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "swing-labeler",
            prompt: "Label each swing on this chart, then classify the trend.",
            points: BEARISH,
            trend: "Downtrend",
            trendExplain:
              "Every peak is a Lower High and every trough a Lower Low — a clean downtrend. Sellers keep pressing earlier each time.",
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Beginners instinctively look for reasons to buy. In a downtrend, structure is screaming the opposite — respect what the swings tell you, not what you hope for.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Downtrend = Lower Highs + Lower Lows. The first higher high is the earliest hint the downtrend may be ending.",
        },
      ],
    },
    {
      id: "ms-four-point-rule",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "the-four-point-rule",
      title: "The Four-Point Rule",
      description: "Read only the latest four swings to know the trend instantly.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 4,
      xpReward: 55,
      prerequisites: ["ms-bearish-structure"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "You Only Need Four Points" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Charts look overwhelming until you learn this: you don't read the whole thing, you read the LATEST FOUR swing points. Four agreeing points (high, low, high, low) confirm a trend — the market has committed to a direction twice in a row. This is the fastest way to read any chart under pressure.",
        },
        {
          id: "example1",
          type: "example",
          content:
            "Latest four points read HL → HH → HL → HH. Two higher highs and two higher lows in sequence = confirmed uptrend. You didn't need the previous fifty candles — just the last four turning points.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "swing-labeler",
            prompt:
              "Label the four latest swings, then state the trend they confirm.",
            points: BULLISH.slice(2),
            trend: "Uptrend",
            trendExplain:
              "HL → HH → HL → HH: four agreeing points confirm the uptrend. The four-point read is all you need to establish direction.",
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "When the latest four points DON'T agree (e.g. HH, HL, HH, LL), the trend is in question — that's your cue to slow down and look for continuation vs reversal.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Read the latest four swings. Four agreeing points confirm a trend; disagreement means transition — investigate before trading.",
        },
      ],
    },
    {
      id: "ms-trend-detection",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "trend-detection",
      title: "Trend Detection",
      description: "Uptrend, downtrend, range, or transition — classify them all.",
      lessonType: "interactive",
      difficulty: "beginner",
      order: 5,
      xpReward: 55,
      prerequisites: ["ms-four-point-rule"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Four Possible Verdicts" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Every chart resolves into one of four states. Uptrend: HH + HL. Downtrend: LH + LL. Range: highs and lows roughly equal, no progress. Transition: the structure is breaking — an uptrend printing its first lower low, or a downtrend printing its first higher high. Naming the state correctly is step one of every trade decision.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "swing-labeler",
            prompt: "Label the swings — then decide what this structure is doing.",
            points: RANGE,
            trend: "Range",
            trendExplain:
              "The highs and lows overlap without net progress — price is ranging. There's no trend to follow, so most professionals stand aside here.",
          },
        },
        {
          id: "w2",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "sort-buckets",
            prompt: "Match each swing sequence to its market state.",
            buckets: ["Uptrend", "Downtrend", "Range", "Transition"],
            items: [
              { label: "HH, HL, HH, HL", bucket: "Uptrend", explain: "Agreeing higher highs and higher lows." },
              { label: "LH, LL, LH, LL", bucket: "Downtrend", explain: "Agreeing lower highs and lower lows." },
              { label: "Equal highs, equal lows", bucket: "Range", explain: "No net progress in either direction." },
              { label: "HH, HL, HH, LL", bucket: "Transition", explain: "An uptrend just printed its first lower low — structure is breaking." },
            ],
          },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Uptrend, downtrend, range, transition. Classify the state first — it decides whether you even look for a trade.",
        },
      ],
    },
    {
      id: "ms-continuation-reversal",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "continuation-vs-reversal",
      title: "Continuation vs Reversal",
      description: "Is the market resuming the trend, or turning against it?",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 6,
      xpReward: 60,
      prerequisites: ["ms-trend-detection"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "A Different Question" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Trend detection asks 'what trend exists?'. Continuation vs reversal asks a harder question: 'what is the market ATTEMPTING to do next?' A continuation keeps the structure intact (another HH/HL in an uptrend). A reversal breaks it (the first LL in an uptrend, or the first HH in a downtrend). Reading this correctly is the difference between trading with the move and getting run over by it.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "continuation-predictor",
            prompt:
              "This was a clean uptrend. It just printed the swing shown as point 5. What is the market attempting?",
            points: EARLY_REVERSAL,
            correct: "Reversal",
            explain:
              "The uptrend just broke its higher-low sequence with a LOWER low (point 5). That's the first structural evidence of a reversal — buyers lost the level they'd been defending.",
          },
        },
        {
          id: "w2",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "continuation-predictor",
            prompt:
              "A persistent downtrend just printed point 5 — a higher high. What is the market attempting?",
            points: DOWN_TO_REVERSAL,
            correct: "Reversal",
            explain:
              "The downtrend printed its first HIGHER high, breaking the lower-high sequence. This is the earliest structural sign the downtrend may be reversing.",
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "One broken swing is a warning, not a confirmation. Reversals often need a broken structure AND a new opposite swing (e.g. a lower low FOLLOWED by a lower high) before professionals commit.",
          metadata: { variant: "tip" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Continuation keeps structure intact; reversal breaks it. The first broken swing is a warning — demand confirmation before trading the turn.",
        },
      ],
    },
    {
      id: "ms-phases",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "phase-1-and-phase-2",
      title: "Phase 1 & Phase 2",
      description: "Impulse vs pullback — and why you only trade one of them.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 7,
      xpReward: 60,
      prerequisites: ["ms-continuation-reversal"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Trend Breathes" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Every trend moves in two phases. Phase 1 is the impulse — the strong, decisive leg in the trend's direction. Phase 2 is the pullback — the slower drift back against it. The professional rule: you never chase Phase 1 once it's running, and you never trade INTO Phase 2. You prepare during Phase 2 and enter as the next Phase 1 begins.",
        },
        {
          id: "def1",
          type: "definition",
          content: "The impulsive leg moving WITH the trend — strong candles, decisive progress. The real direction.",
          metadata: { term: "Phase 1 (impulse)" },
        },
        {
          id: "def2",
          type: "definition",
          content: "The corrective pullback against the trend — smaller, overlapping candles. Preparation time, not entry time.",
          metadata: { term: "Phase 2 (pullback)" },
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "For each situation, identify the phase and the correct action.",
            options: ["Phase 1 — don't chase", "Phase 2 — prepare", "Wait for resumption"],
            scenarios: [
              {
                situation:
                  "A strong bullish impulse candle just launched off a higher low. Price is already 40 pips up and accelerating.",
                correct: "Phase 1 — don't chase",
                coaching:
                  "This is Phase 1 in full flight. Chasing here means a terrible entry with a far-away stop. The time to act was as it BEGAN, not mid-impulse.",
              },
              {
                situation:
                  "After a strong up-leg, price is drifting slowly back down toward the rising zone on small overlapping candles.",
                correct: "Phase 2 — prepare",
                coaching:
                  "This is the Phase 2 pullback. Never trade into it — but this is exactly when you prepare your entry for the next impulse.",
              },
              {
                situation:
                  "The pullback has reached the higher-low zone and a strong bullish candle just closed out of it.",
                correct: "Wait for resumption",
                coaching:
                  "Phase 1 is resuming out of the zone — THIS is the professional entry: buying the start of the new impulse, not the middle of the old one.",
              },
            ],
          },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Phase 1 = impulse (don't chase). Phase 2 = pullback (prepare, don't trade into it). Enter as the next Phase 1 begins out of the zone.",
        },
      ],
    },
    {
      id: "ms-trend-builder",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "build-the-structure",
      title: "Build the Structure",
      description: "Reverse the skill — construct a clean trend yourself.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 8,
      xpReward: 55,
      prerequisites: ["ms-phases"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "If You Can Build It, You Can Read It" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Identifying structure is one skill; constructing it cements the pattern in your mind. Build a clean uptrend by placing alternating peaks and troughs — each peak higher than the last, each trough higher than the last.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "trend-builder",
            prompt: "Structure Builder: build a clean uptrend.",
            target: "Uptrend",
            pointCount: 5,
          },
        },
        {
          id: "w2",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "trend-builder",
            prompt: "Now build a clean downtrend.",
            target: "Downtrend",
            pointCount: 5,
          },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "An uptrend needs each peak (HH) and each trough (HL) higher than the last; a downtrend needs each lower. Building the pattern hardwires your recognition of it.",
        },
      ],
    },
    {
      id: "ms-trend-quality",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "trend-quality",
      title: "Trend Quality",
      description: "Not all trends are equal — grade their strength.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 9,
      xpReward: 55,
      prerequisites: ["ms-trend-builder"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Grade the Trend, Not Just Name It" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "A trend can be technically valid but low quality. Strong trends have decisive impulses and shallow pullbacks. Weak trends have overlapping candles, deep pullbacks that nearly break structure, and hesitant impulses. The strongest setups come from strong trends — grading quality tells you how much to trust a continuation.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "sort-buckets",
            prompt: "Grade each trend description.",
            buckets: ["Strong", "Weak / late", "Likely range"],
            items: [
              { label: "Clean HH/HL, shallow pullbacks, big impulses", bucket: "Strong", explain: "Textbook strength — high-confidence continuation." },
              { label: "Deep pullback that nearly hit the last higher low", bucket: "Weak / late", explain: "The trend is struggling to hold structure — reduce confidence." },
              { label: "Weak impulse that barely broke the prior high", bucket: "Weak / late", explain: "A feeble break suggests the trend is running out of fuel." },
              { label: "Overlapping candles, highs and lows near equal", bucket: "Likely range", explain: "No clean structure — this is a range, not a trend." },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Deep pullbacks and weak breaks are the market whispering that the trend is tiring. Strong trends barely pull back before the next impulse.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Strong trends: decisive impulses, shallow pullbacks. Weak trends: hesitant breaks, deep pullbacks. Grade quality to size your confidence.",
        },
      ],
    },
    {
      id: "ms-capstone",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "capstone-read-the-chart",
      title: "Capstone: Read the Chart",
      description: "Full workflow — structure, trend, phase, continuation, and the decision.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 10,
      xpReward: 80,
      prerequisites: ["ms-trend-quality"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Put It All Together" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "A professional reads a chart in a fixed sequence: label the latest swings → classify the trend → identify the phase → decide continuation or reversal → then, and only then, decide trade / wait / skip. Run the full sequence on this chart.",
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "swing-labeler",
            prompt: "Step 1–2: Label the swings and classify the trend.",
            points: PHASE2_PULLBACK,
            trend: "Uptrend",
            trendExplain:
              "HL → HH → HL → HH → HL: a clean uptrend, currently sitting on its latest higher low.",
          },
        },
        {
          id: "w2",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "continuation-predictor",
            prompt:
              "Step 3–4: The uptrend just pulled back to its higher-low zone (point 5). Most likely next?",
            points: PHASE2_PULLBACK,
            correct: "Continuation",
            explain:
              "Structure is fully intact (higher lows holding) and price pulled back to the zone in a Phase 2 correction. The base case is a continuation — the next impulse up.",
          },
        },
        {
          id: "w3",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "Step 5: The professional decision.",
            scenarios: [
              {
                situation:
                  "Uptrend intact, price at the higher-low zone (Phase 2), but the pullback candle is still forming and hasn't confirmed a bullish rejection yet.",
                correct: "Wait",
                coaching:
                  "Everything aligns except the trigger. This is a WAIT — set an alert at the zone and enter only when Phase 1 resumes with a confirmed bullish close.",
              },
              {
                situation:
                  "The pullback zone held and a strong bullish candle just closed out of it, resuming Phase 1. Risk is 1%, stop below the higher low.",
                correct: "Trade",
                coaching:
                  "Structure, phase, continuation, and trigger all agree with defined risk. This is the trade the whole sequence was built to find.",
              },
              {
                situation:
                  "Instead of holding, price sliced through the higher-low zone and printed a clear lower low on strong candles.",
                correct: "Skip",
                coaching:
                  "The higher-low broke — the continuation thesis is invalidated and structure is now transitioning. Skip: never trade a continuation whose structure just failed.",
              },
            ],
          },
        },
        {
          id: "safety1",
          type: "safety-note",
          content:
            "Educational simulator only. Not financial advice. Structure reading improves decision quality; it does not predict the future or guarantee outcomes.",
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Label → classify → phase → continuation/reversal → trade/wait/skip. Run this sequence on every chart until it becomes instinct.",
        },
      ],
    },
    {
      id: "ms-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "market-structure-assessment",
      title: "Market Structure Assessment",
      description: "The milestone — structure, trends, phases, continuation, and decisions.",
      lessonType: "quiz",
      difficulty: "intermediate",
      order: 11,
      xpReward: 100,
      prerequisites: ["ms-capstone"],
      estimatedMinutes: 0,
      quizId: "market-structure-assessment",
      contentBlocks: [],
    },
  ],
}
