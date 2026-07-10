import type { CourseModule } from "@/lib/course/types"

const PATH_ID = "trading-psychology"
const MODULE_ID = "tp-m2"

/** Module 2 — Emotions: fear, greed, FOMO, hope, revenge, overconfidence. */
export const emotionsModule: CourseModule = {
  id: MODULE_ID,
  pathId: PATH_ID,
  title: "Emotions at the Screen",
  description:
    "Fear, greed, FOMO, hope, revenge, and overconfidence — recognise each one in real time and know its antidote.",
  order: 2,
  estimatedMinutes: 0,
  lessons: [
    {
      id: "tp-m2-fear-greed",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "fear-and-greed",
      title: "Fear & Greed",
      description: "The two primal forces — and the mirror-image mistakes they cause.",
      lessonType: "reading",
      difficulty: "intermediate",
      order: 1,
      xpReward: 45,
      prerequisites: [],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "Two Sides of One Coin" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Fear shows up as: skipping valid setups after a loss, cutting winners at +0.3R 'before they turn', tightening stops into the noise, and freezing at the entry trigger. Greed shows up as: oversizing after wins, holding past targets 'because it's running', adding to winners until one reversal erases everything, and forcing trades in dead markets because sitting still feels like losing.",
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Both emotions share a root: attaching this trade's outcome to your wellbeing. The probabilistic mindset from Module 1 is the structural fix — when one trade is just one of the next hundred, there's nothing to fear and nothing to grab. The tactical fix is mechanical rules: fixed risk, pre-placed stops and targets, and a written plan that decides BEFORE emotions arrive.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Same trader, same setup, two states. Calm week: enters at the trigger, holds to the 2R target, wins. After three losses: sees the identical setup, hesitates, enters late at a worse price, panics at the first pullback, exits at −0.4R. The setup didn't change — the nervous system did.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "You cannot delete emotions — you can only remove their decision-making power. That's what rules, checklists, and pre-placed orders actually do.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Fear shrinks good positions and exits early; greed oversizes and overstays. Both dissolve when the single trade stops mattering.",
        },
      ],
    },
    {
      id: "tp-m2-fomo-revenge",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "fomo-hope-and-revenge",
      title: "FOMO, Hope & Revenge",
      description: "The three account-killers — with a scenario trainer.",
      lessonType: "interactive",
      difficulty: "intermediate",
      order: 2,
      xpReward: 55,
      prerequisites: ["tp-m2-fear-greed"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Three Killers" },
        {
          id: "def1",
          type: "definition",
          content:
            "Fear of missing out — entering late, without a setup, because price is running and everyone else seems to be profiting.",
          metadata: { term: "FOMO" },
        },
        {
          id: "def2",
          type: "definition",
          content:
            "Holding a losing position past invalidation because it 'might come back' — replacing analysis with wishing.",
          metadata: { term: "Hope trading" },
        },
        {
          id: "def3",
          type: "definition",
          content:
            "Immediately re-entering after a loss — usually bigger — to 'win it back'. The single fastest account destroyer.",
          metadata: { term: "Revenge trading" },
        },
        {
          id: "w1",
          type: "interactive-widget",
          content: "",
          widget: {
            kind: "decision-scenarios",
            prompt: "What would you do? Choose honestly — the coaching is instant.",
            options: ["Enter / hold", "Stand aside", "Close the position"],
            scenarios: [
              {
                situation:
                  "GBP/USD has rallied 80 pips in an hour without you. Twitter is euphoric. No pullback, no setup — but it keeps going.",
                correct: "Stand aside",
                coaching:
                  "Pure FOMO. Late entries after extended moves have terrible risk-reward — the stop is miles away and the move is exhausted. The market prints new setups every day.",
              },
              {
                situation:
                  "Your long broke below the higher low that defined the trade. You're −1.3R because you didn't set a hard stop. It 'feels oversold'.",
                correct: "Close the position",
                coaching:
                  "The idea is invalidated — you're not trading anymore, you're hoping. Every pip held past invalidation is unbudgeted risk.",
              },
              {
                situation:
                  "Stopped out −1R five minutes ago. You spot a 'revenge setup' on the same pair — it half-qualifies, and doubling size would recover the loss in one move.",
                correct: "Stand aside",
                coaching:
                  "Half-qualifying setups at double size after a loss is the exact anatomy of revenge trading. The loss is gone; the next trade must earn its place on its own merits at normal size.",
              },
              {
                situation:
                  "A fully qualifying setup appears on your watchlist pair. Context agrees, risk is 1%, stop behind structure. You lost the previous trade an hour ago.",
                correct: "Enter / hold",
                coaching:
                  "This is NOT revenge — it's the system producing its next signal. The difference: full qualification, normal size, and the previous loss playing no role in the decision.",
              },
            ],
          },
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "The tell of revenge trading is urgency. Real setups don't need to happen RIGHT NOW. If a trade feels urgent, that urgency is the loss talking.",
          metadata: { variant: "mistake" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "FOMO chases, hope holds, revenge doubles. All three replace system output with emotional impulse — and all three announce themselves with urgency.",
        },
      ],
    },
    {
      id: "tp-m2-overconfidence",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "overconfidence",
      title: "Overconfidence",
      description: "Why winning streaks are more dangerous than losing streaks.",
      lessonType: "reading",
      difficulty: "intermediate",
      order: 3,
      xpReward: 45,
      prerequisites: ["tp-m2-fomo-revenge"],
      estimatedMinutes: 0,
      contentBlocks: [
        { id: "h1", type: "heading", content: "The Danger of Being Right" },
        {
          id: "p1",
          type: "paragraph",
          content:
            "Losing streaks hurt, but winning streaks kill. After five wins, the brain quietly rewrites the story: 'I've cracked it.' Risk creeps from 1% to 2% to 5%. Setups get looser — after all, everything's working. Then the normal loss arrives, magnified by the inflated size, and erases weeks of profit in an afternoon.",
        },
        {
          id: "p2",
          type: "paragraph",
          content:
            "Remember the coin flip simulator: streaks are what randomness LOOKS like. Five wins at a 50% win rate happens constantly and means nothing. The professional response to a hot streak is the same as to a cold one: change nothing. Same risk, same rules, same checklist.",
        },
        {
          id: "ex1",
          type: "example",
          content:
            "Month 1: +6% following every rule at 1% risk. Month 2, feeling invincible: risk creeps to 3%, setups loosen. One normal 4-loss streak later: −11%. The system never stopped working — the trader stopped running it.",
        },
        {
          id: "callout1",
          type: "callout",
          content:
            "Audit yourself after WINS, not just losses. The question 'am I still following the rules?' matters most exactly when everything is working.",
          metadata: { variant: "key-idea" },
        },
        {
          id: "sum1",
          type: "summary",
          content:
            "Winning streaks inflate risk and erode discipline invisibly. Same rules in hot streaks and cold — that consistency IS the professionalism.",
        },
      ],
    },
    {
      id: "tp-m2-quiz",
      moduleId: MODULE_ID,
      pathId: PATH_ID,
      slug: "emotions-check",
      title: "Emotions Check",
      description: "Test recognition of the six trading emotions.",
      lessonType: "quiz",
      difficulty: "intermediate",
      order: 4,
      xpReward: 50,
      prerequisites: ["tp-m2-overconfidence"],
      estimatedMinutes: 0,
      quizId: "emotions-check",
      contentBlocks: [],
    },
  ],
}
