import { buildZoneConcept } from "@/content/library/trading-in-the-zone/build"
import type { BookLabConcept } from "@/lib/book-lab/types"

const SECTION = "tz-discipline"

export const disciplineConcepts: BookLabConcept[] = [
  buildZoneConcept({
    slug: "following-rules",
    sectionId: SECTION,
    title: "Following Rules",
    summary:
      "Rules exist to protect you from yourself in the moment when emotion is strongest.",
    difficulty: "beginner",
    explanation:
      "You write your rules when you're calm and objective, precisely so you have something to follow when you're not. The market constantly tempts you to break them, and each break that gets rewarded by luck teaches your brain that breaking rules pays. Discipline is the willingness to follow your rules even when you 'feel' otherwise — and especially when breaking them just worked. Rule-following is the bridge between a good plan and good results.",
    whyMatters:
      "A great strategy executed without discipline produces the same result as having no strategy at all.",
    commonMistake:
      "Treating rules as suggestions and overriding them whenever a trade 'feels' different.",
    reflectionPrompt:
      "Which rule do you break most often, and what feeling triggers the break?",
    relatedConceptSlugs: ["avoiding-impulsive-trades", "trading-without-hope"],
    quizQuestions: [
      {
        question: "The purpose of trading rules is to:",
        options: [
          { id: "a", text: "Protect you from emotional decisions in the moment" },
          { id: "b", text: "Guarantee winning trades" },
          { id: "c", text: "Replace having an edge" },
          { id: "d", text: "Impress other traders" },
        ],
        correctAnswer: "a",
        explanation: "Rules made when calm guard you when you're not.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "avoiding-impulsive-trades",
    sectionId: SECTION,
    title: "Avoiding Impulsive Trades",
    summary:
      "An impulsive trade is one you take to relieve a feeling, not to execute an edge.",
    difficulty: "intermediate",
    explanation:
      "Boredom, fear of missing out, frustration, and excitement all generate the urge to click. The impulsive trade isn't justified by your setup — it's justified by your emotional state. The defense is a pre-trade checklist: if the setup doesn't meet every written condition, there is no trade, no matter how strong the urge. Creating a deliberate pause between impulse and action is where discipline lives.",
    whyMatters:
      "Impulsive trades have no edge, so over time they bleed the account that your good trades worked to build.",
    commonMistake:
      "Clicking into a position 'just to be in the move' without checking it against your criteria.",
    reflectionPrompt:
      "What checklist will you run before every entry to filter out impulse trades?",
    relatedConceptSlugs: ["following-rules", "emotional-self-control"],
    quizQuestions: [
      {
        question: "An impulsive trade is taken to:",
        options: [
          { id: "a", text: "Relieve an emotional state, not to execute an edge" },
          { id: "b", text: "Follow a written setup" },
          { id: "c", text: "Reduce risk" },
          { id: "d", text: "Confirm a checklist" },
        ],
        correctAnswer: "a",
        explanation: "Impulse trades serve feelings, not edges.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "handling-losing-streaks",
    sectionId: SECTION,
    title: "Handling Losing Streaks",
    summary:
      "Losing streaks are statistically normal. How you respond decides whether they end or deepen.",
    difficulty: "advanced",
    explanation:
      "Even a strong edge produces clusters of losses. The danger isn't the streak itself — it's the reaction: oversizing to recover, abandoning the plan, or trading in a tilted, fearful state. The professional response is the opposite: reduce size, return to your highest-quality setups, and protect your mental capital. A streak handled calmly is a temporary drawdown; a streak handled emotionally becomes a blown account.",
    whyMatters:
      "Most account-ending damage happens during losing streaks, when emotion overrides risk control.",
    commonMistake:
      "Doubling size after several losses to 'win it all back' in one trade.",
    reflectionPrompt:
      "Write your written protocol for what you do after three consecutive losses.",
    relatedConceptSlugs: ["accepting-random-outcomes", "risk-acceptance"],
    quizQuestions: [
      {
        question: "The professional response to a losing streak is to:",
        options: [
          { id: "a", text: "Reduce size and return to your best setups" },
          { id: "b", text: "Double size to recover quickly" },
          { id: "c", text: "Abandon your plan immediately" },
          { id: "d", text: "Trade more frequently" },
        ],
        correctAnswer: "a",
        explanation: "Protect capital and mental state during drawdowns.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "handling-winning-streaks",
    sectionId: SECTION,
    title: "Handling Winning Streaks",
    summary:
      "Winning streaks are more dangerous than losing streaks because they breed overconfidence.",
    difficulty: "advanced",
    explanation:
      "After a run of wins, euphoria sets in: you feel invincible, size up beyond your plan, and start skipping your criteria because 'everything works right now.' That's exactly when a single oversized loss can erase weeks of gains. The mature trader treats a winning streak with the same neutrality as a losing one — same rules, same size, same process. Success is the moment to tighten discipline, not loosen it.",
    whyMatters:
      "Overconfidence from winning is how disciplined traders give back profits in a single careless trade.",
    commonMistake:
      "Tripling position size mid-streak and taking lower-quality setups because 'I can't lose right now.'",
    reflectionPrompt:
      "How will you keep your size and rules constant when you feel invincible?",
    relatedConceptSlugs: ["removing-ego", "confidence-vs-certainty"],
    quizQuestions: [
      {
        question: "Winning streaks are dangerous because they:",
        options: [
          { id: "a", text: "Breed overconfidence and rule-breaking" },
          { id: "b", text: "Guarantee future wins" },
          { id: "c", text: "Reduce your risk" },
          { id: "d", text: "Improve your discipline automatically" },
        ],
        correctAnswer: "a",
        explanation: "Euphoria loosens discipline at the worst time.",
      },
    ],
  }),
  buildZoneConcept({
    slug: "emotional-self-control",
    sectionId: SECTION,
    title: "Emotional Self-Control",
    summary:
      "Self-control isn't suppressing emotion — it's not letting emotion drive your execution.",
    difficulty: "advanced",
    explanation:
      "You can't stop feelings from arising, but you can stop them from controlling your clicks. The key is awareness: noticing the surge of fear, greed, or frustration as it happens, naming it, and choosing to act from your plan instead. Tools like pre-defined risk, scheduled breaks, and a daily loss limit externalize self-control so you don't have to win every internal battle in real time. Emotional regulation is the trader's most valuable trainable skill.",
    whyMatters:
      "Unregulated emotion turns a sound plan into a sequence of reactive, account-damaging decisions.",
    commonMistake:
      "Trying to 'tough it out' in a tilted state instead of stepping away from the screen.",
    reflectionPrompt:
      "What early warning sign tells you you're becoming emotional, and what will you do when you notice it?",
    relatedConceptSlugs: ["self-awareness", "letting-go-of-individual-trades"],
    quizQuestions: [
      {
        question: "Emotional self-control means:",
        options: [
          { id: "a", text: "Not letting emotions drive your execution" },
          { id: "b", text: "Never feeling any emotion" },
          { id: "c", text: "Trading harder when tilted" },
          { id: "d", text: "Ignoring your plan" },
        ],
        correctAnswer: "a",
        explanation: "Feel the emotion, act from the plan.",
      },
    ],
  }),
]
