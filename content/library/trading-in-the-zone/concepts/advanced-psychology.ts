import { buildZoneConcept } from "@/content/library/trading-in-the-zone/build"
import type { BookLabConcept } from "@/lib/book-lab/types"

const SECTION = "tz-advanced-psychology"

export const advancedPsychologyConcepts: BookLabConcept[] = [
  buildZoneConcept({
    slug: "flow-state",
    sectionId: SECTION,
    title: "Flow State",
    summary:
      "In the zone, you perceive opportunity and act on it without internal resistance or fear.",
    difficulty: "advanced",
    explanation:
      "Flow — being 'in the zone' — is a state of relaxed, absorbed focus where you and the market feel connected and action is effortless. It arises when you've fully accepted risk and have no inner conflict about what to do. You can't force flow, but you can create the conditions for it: a clear plan, accepted risk, freedom from the need to be right, and complete presence. From flow, execution feels easy because there's nothing to fight inside.",
    whyMatters:
      "Flow is where your best trading happens; fear and self-doubt are exactly what block it.",
    commonMistake:
      "Trying to force the zone through effort instead of removing the inner conflicts that prevent it.",
    reflectionPrompt:
      "When have you felt 'in the zone' while trading, and what conditions made it possible?",
    relatedConceptSlugs: ["trading-without-fear", "becoming-the-consistent-trader"],
    quizQuestions: [
      {
        question: "Flow state in trading arises when you have:",
        options: [
          { id: "a", text: "Accepted risk and no inner conflict about acting" },
          { id: "b", text: "Certainty about the outcome" },
          { id: "c", text: "A larger position size" },
          { id: "d", text: "A winning streak" },
        ],
        correctAnswer: "a",
        explanation: "Flow comes from the absence of inner resistance.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "self-awareness",
    sectionId: SECTION,
    title: "Self Awareness",
    summary:
      "You can't change what you can't see. Awareness of your mental state is the foundation of control.",
    difficulty: "advanced",
    explanation:
      "Most trading errors happen unconsciously — you're tilted before you realize it. Self-awareness is the skill of observing your own thoughts, emotions, and urges in real time, before they turn into clicks. Developing it through journaling, pausing, and honest review lets you catch the early signals of fear, greed, or frustration and intervene. The aware trader notices 'I'm about to revenge trade' and stops; the unaware trader only realizes it afterward in the P&L.",
    whyMatters:
      "Self-awareness is the early-warning system that prevents emotional states from becoming costly trades.",
    commonMistake:
      "Reviewing only your charts and entries while ignoring your emotional state at the time of each decision.",
    reflectionPrompt:
      "Add an emotional state note to your next ten trades. What patterns do you notice?",
    relatedConceptSlugs: ["emotional-self-control", "removing-ego"],
    quizQuestions: [
      {
        question: "Self-awareness helps trading by letting you:",
        options: [
          { id: "a", text: "Catch emotional states before they drive a trade" },
          { id: "b", text: "Predict the market" },
          { id: "c", text: "Eliminate all losses" },
          { id: "d", text: "Trade without any plan" },
        ],
        correctAnswer: "a",
        explanation: "Awareness enables intervention before the error.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "pattern-recognition-vs-prediction",
    sectionId: SECTION,
    title: "Pattern Recognition vs Prediction",
    summary:
      "Recognize repeatable patterns and play their odds — don't try to predict a guaranteed future.",
    difficulty: "advanced",
    explanation:
      "Your edge is built on patterns that have offered favorable odds in the past. Recognizing a pattern tells you the probabilities are in your favor; it does not tell you this instance will work. Prediction demands certainty the market can't give and sets you up to feel betrayed when the pattern fails. The skilled trader recognizes the pattern, sizes appropriately for the odds, and accepts that some instances simply won't pay — while the predictor stakes their ego on each one being right.",
    whyMatters:
      "Confusing recognition with prediction reintroduces the need to be right and the fear of being wrong.",
    commonMistake:
      "Believing a familiar pattern 'has to' work this time and over-committing because of it.",
    reflectionPrompt:
      "Do you treat your favorite setup as a probability or as a prediction? How does that affect your sizing?",
    relatedConceptSlugs: ["thinking-in-probabilities", "the-five-fundamental-truths"],
    quizQuestions: [
      {
        question: "Recognizing a pattern tells you:",
        options: [
          { id: "a", text: "The probabilities are favorable, not that this instance will win" },
          { id: "b", text: "Exactly what price will do" },
          { id: "c", text: "That you can't lose" },
          { id: "d", text: "To remove your stop" },
        ],
        correctAnswer: "a",
        explanation: "Patterns give odds, not guarantees.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "removing-ego",
    sectionId: SECTION,
    title: "Removing Ego",
    summary:
      "When your self-worth rides on being right, you'll defend losing trades to protect your ego.",
    difficulty: "advanced",
    explanation:
      "Ego turns trading into a battle to be right, which is fatal in a probabilistic game where being wrong is routine. An ego-driven trader holds losers to avoid admitting a mistake and brags about wins to feel superior. Removing ego means decoupling your identity from any single trade: a loss is information, not an insult; a win is the edge working, not proof of genius. Egoless trading lets you cut losses instantly and follow the market instead of your pride.",
    whyMatters:
      "Ego is the single biggest reason traders refuse to take small losses, turning them into catastrophic ones.",
    commonMistake:
      "Holding a losing trade to 'prove you were right' instead of accepting the market's verdict.",
    reflectionPrompt:
      "Recall a loss you held too long. How much of that was protecting your ego?",
    relatedConceptSlugs: ["eliminating-emotional-bias", "letting-go-of-individual-trades"],
    quizQuestions: [
      {
        question: "Ego harms trading most by causing you to:",
        options: [
          { id: "a", text: "Refuse small losses to avoid being wrong" },
          { id: "b", text: "Follow your stop precisely" },
          { id: "c", text: "Accept randomness" },
          { id: "d", text: "Reduce your size" },
        ],
        correctAnswer: "a",
        explanation: "Ego defends losers, turning them into disasters.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "becoming-the-consistent-trader",
    sectionId: SECTION,
    title: "Becoming the Consistent Trader",
    summary:
      "Consistency is an identity built from accepted truths and repeated disciplined action.",
    difficulty: "advanced",
    explanation:
      "Everything in this book points to one outcome: becoming a trader for whom discipline, probability, and risk acceptance are automatic. You reach it not through a breakthrough but through repetition — thinking from the five truths, accepting risk, following rules, and grading your process until they become who you are. At that point, fear and euphoria no longer run your trading; you do. The consistent trader isn't someone who never loses — it's someone whose behavior stays the same whether they're winning or losing.",
    whyMatters:
      "This is the destination: a stable identity that produces consistent execution and, in turn, consistent results.",
    commonMistake:
      "Looking for one more secret instead of repeating the fundamentals until they become automatic.",
    reflectionPrompt:
      "What is one daily practice that will move you toward becoming the consistent trader?",
    relatedConceptSlugs: ["the-five-fundamental-truths", "becoming-process-focused"],
    quizQuestions: [
      {
        question: "The consistent trader is someone whose:",
        options: [
          { id: "a", text: "Behavior stays the same whether winning or losing" },
          { id: "b", text: "Trades always win" },
          { id: "c", text: "Size grows on every streak" },
          { id: "d", text: "Results never include losses" },
        ],
        correctAnswer: "a",
        explanation: "Consistency is stable behavior across outcomes.",
      },
    ],
  }),
]
