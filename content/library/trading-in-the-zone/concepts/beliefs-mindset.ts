import { buildZoneConcept } from "@/content/library/trading-in-the-zone/build"
import type { BookLabConcept } from "@/lib/book-lab/types"

const SECTION = "tz-beliefs-mindset"

export const beliefsMindsetConcepts: BookLabConcept[] = [
  buildZoneConcept({
    slug: "how-beliefs-shape-decisions",
    sectionId: SECTION,
    title: "How Beliefs Shape Decisions",
    summary:
      "You don't trade the market — you trade your beliefs about it. Beliefs act as a filter on everything you see.",
    difficulty: "intermediate",
    explanation:
      "Two traders look at the same chart and see different things because their beliefs highlight different information. A belief like 'I always give back my profits' will quietly steer you toward the behaviors that make it true. Beliefs feel like facts, but they are learned and can be reshaped. Lasting change in trading comes from upgrading the beliefs that drive your perception and action — not from staring at more charts.",
    whyMatters:
      "If you don't examine your beliefs, they run your trading on autopilot and sabotage every new strategy you adopt.",
    commonMistake:
      "Trying to force new behavior with willpower while leaving the underlying limiting belief untouched.",
    reflectionPrompt:
      "What is one belief about yourself as a trader that may be limiting your results?",
    relatedConceptSlugs: ["the-market-is-neutral", "developing-a-winning-mindset"],
    quizQuestions: [
      {
        question: "Beliefs influence trading because they:",
        options: [
          { id: "a", text: "Filter what information you perceive and act on" },
          { id: "b", text: "Change the price of the asset" },
          { id: "c", text: "Are fixed and unchangeable" },
          { id: "d", text: "Only matter to beginners" },
        ],
        correctAnswer: "a",
        explanation: "Beliefs are a perceptual filter that drives behavior.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "trading-without-fear",
    sectionId: SECTION,
    title: "Trading Without Fear",
    summary:
      "Fear narrows perception and causes hesitation, freezing, and exiting good trades early.",
    difficulty: "intermediate",
    explanation:
      "Fear in trading usually comes from one source: the belief that a loss is unacceptable or means something about you. When you fully accept the risk before entering — defining exactly what you can lose and being at peace with it — there is nothing left to fear. Fearless trading isn't recklessness; it's the calm that comes from having already accepted the worst-case outcome. From that state you can see opportunities clearly instead of flinching at every tick.",
    whyMatters:
      "Fear makes you miss valid entries and bail on winners, turning a profitable edge into a losing one.",
    commonMistake:
      "Entering a trade without truly accepting the loss, so fear hijacks your management the moment price wobbles.",
    reflectionPrompt:
      "Before your next trade, can you state the exact dollar amount you're at peace with losing?",
    relatedConceptSlugs: ["risk-acceptance", "trading-without-hope"],
    quizQuestions: [
      {
        question: "The antidote to trading fear is:",
        options: [
          { id: "a", text: "Fully accepting the risk before you enter" },
          { id: "b", text: "Using a bigger position" },
          { id: "c", text: "Avoiding all losses" },
          { id: "d", text: "Watching price more closely" },
        ],
        correctAnswer: "a",
        explanation: "Pre-accepted risk leaves nothing to fear.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "trading-without-hope",
    sectionId: SECTION,
    title: "Trading Without Hope",
    summary:
      "Hope is fear's twin — it keeps you in losers, hoping for a reversal that your plan never called for.",
    difficulty: "intermediate",
    explanation:
      "Hope feels positive but it's just as destructive as fear. Hope is what makes you move your stop, average down, or hold a loser long past your invalidation level, waiting for the market to rescue you. A disciplined trader acts on information and rules, not on wishes. When the trade is wrong, you're out — no negotiating, no hoping. Replacing hope with rule-based action is what protects your capital from the slow bleed of 'just one more candle.'",
    whyMatters:
      "Hope converts small, planned losses into large, account-damaging ones.",
    commonMistake:
      "Cancelling or widening a stop because you 'feel' the trade will come back.",
    reflectionPrompt:
      "What is your rule for exiting a loser, and will you honor it without hoping?",
    relatedConceptSlugs: ["trading-without-fear", "following-rules"],
    quizQuestions: [
      {
        question: "Hope is dangerous in trading because it:",
        options: [
          { id: "a", text: "Keeps you in losing trades past your invalidation point" },
          { id: "b", text: "Improves your win rate" },
          { id: "c", text: "Tightens your risk control" },
          { id: "d", text: "Is unrelated to discipline" },
        ],
        correctAnswer: "a",
        explanation: "Hope overrides your exit rules.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "eliminating-emotional-bias",
    sectionId: SECTION,
    title: "Eliminating Emotional Bias",
    summary:
      "Emotional bias makes you see what you want to see. Objectivity is a trained state, not a personality trait.",
    difficulty: "advanced",
    explanation:
      "When you're emotionally attached to a position, your mind filters out information that contradicts it and amplifies anything that supports it. You become unable to perceive the market objectively. The cure is to build a state of mind where you have no stake in being right — only in following your process. You can train this: define your trade fully in advance, accept the risk, and commit to acting on what the market shows rather than what you wish it would do.",
    whyMatters:
      "Bias blinds you to exit signals and traps you on the wrong side of a move.",
    commonMistake:
      "Ignoring clear reversal signals because admitting them would mean admitting you're wrong.",
    reflectionPrompt:
      "When did you last filter out information because it threatened your position?",
    relatedConceptSlugs: ["the-market-is-neutral", "removing-ego"],
    quizQuestions: [
      {
        question: "Emotional attachment to a trade causes you to:",
        options: [
          { id: "a", text: "Filter out contradicting information" },
          { id: "b", text: "See the market more clearly" },
          { id: "c", text: "Follow your rules better" },
          { id: "d", text: "Reduce your risk automatically" },
        ],
        correctAnswer: "a",
        explanation: "Attachment distorts perception toward what you want.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "developing-a-winning-mindset",
    sectionId: SECTION,
    title: "Developing a Winning Mindset",
    summary:
      "A winning mindset is built from a few empowering beliefs, practiced until they become automatic.",
    difficulty: "advanced",
    explanation:
      "You don't become consistent by trying harder; you become consistent by installing beliefs that make discipline effortless. Beliefs like 'I am a risk manager,' 'anything can happen,' and 'I don't need to know what happens next to make money' change how you experience every trade. The work is repetition: deliberately thinking and acting from these beliefs until they replace the fearful, hopeful defaults. A winning mindset is a skill you train, not a gift you're born with.",
    whyMatters:
      "Without rebuilt beliefs, your old fearful defaults reassert themselves the moment money is on the line.",
    commonMistake:
      "Expecting mindset to change overnight instead of practicing the new beliefs trade after trade.",
    reflectionPrompt:
      "Which empowering belief will you rehearse before every session this week?",
    relatedConceptSlugs: ["how-beliefs-shape-decisions", "the-five-fundamental-truths"],
    quizQuestions: [
      {
        question: "A winning mindset is best described as:",
        options: [
          { id: "a", text: "A set of trained beliefs practiced until automatic" },
          { id: "b", text: "An inborn talent" },
          { id: "c", text: "The result of more screen time alone" },
          { id: "d", text: "Luck over a short period" },
        ],
        correctAnswer: "a",
        explanation: "It is built through deliberate repetition of beliefs.",
      },
    ],
  }),
]
