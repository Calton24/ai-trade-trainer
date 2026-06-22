import type { CourseQuiz } from "@/lib/course/types"

export const iccCheckQuiz: CourseQuiz = {
  id: "icc-framework-check",
  pathId: "icc-strategy",
  lessonId: "icc-m2-quiz",
  title: "ICC Framework Check",
  description:
    "Test your understanding of indication, correction, and continuation.",
  passingScore: 70,
  xpReward: 60,
  questions: [
    {
      id: "icc-1",
      type: "multiple-choice",
      question: "What does the indication phase show you?",
      options: [
        { id: "a", text: "A strong, decisive push that signals direction" },
        { id: "b", text: "The exact price to enter a trade" },
        { id: "c", text: "A guarantee the trend will continue" },
      ],
      correctAnswer: "a",
      explanation:
        "The indication is the first strong push. It signals where the larger players are pressing — you note the direction, you don't enter yet.",
      beginnerHint: "It's the first clue, not the entry.",
      relatedConcept: "Indication",
    },
    {
      id: "icc-2",
      type: "multiple-choice",
      question: "What is the correction in the ICC framework?",
      options: [
        { id: "a", text: "A pullback against the indication, into a discount zone" },
        { id: "b", text: "A second push in the same direction" },
        { id: "c", text: "A breakout of a major level" },
      ],
      correctAnswer: "a",
      explanation:
        "The correction pulls back against the push on smaller candles, building the zone where you wait for a continuation entry.",
      beginnerHint: "It moves the opposite way to the push, more slowly.",
      relatedConcept: "Correction",
    },
    {
      id: "icc-3",
      type: "true-false",
      question:
        "In ICC, you enter on the continuation — when price reacts out of the correction zone in the direction of the indication.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "true",
      explanation:
        "The continuation is the entry trigger: price leaves the correction zone in the original push direction, stop below the zone, target beyond the prior high.",
      relatedConcept: "Continuation",
    },
    {
      id: "icc-4",
      type: "scenario",
      question:
        "Price pushed up strongly, pulled back into a zone, but then kept falling straight through it. What should you do?",
      options: [
        { id: "a", text: "Stand aside — the setup is invalid once the zone fails" },
        { id: "b", text: "Buy more aggressively as it falls" },
        { id: "c", text: "Move your stop further away to stay in" },
      ],
      correctAnswer: "a",
      explanation:
        "If price breaks through the correction zone instead of reacting from it, the continuation never confirmed. No trade — protect your capital.",
      beginnerHint: "The setup needs a reaction from the zone, not a break through it.",
      relatedConcept: "Continuation",
    },
  ],
}
