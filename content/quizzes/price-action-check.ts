import type { CourseQuiz } from "@/lib/course/types"

export const priceActionLevelsCheckQuiz: CourseQuiz = {
  id: "price-action-levels-check",
  pathId: "price-action",
  lessonId: "pa-m1-quiz-levels",
  title: "Levels Check",
  description: "Test your understanding of support, resistance, and breakouts.",
  passingScore: 70,
  xpReward: 50,
  questions: [
    {
      id: "palc-1",
      type: "multiple-choice",
      question: "What is support?",
      options: [
        { id: "a", text: "A price floor where buyers repeatedly step in" },
        { id: "b", text: "A price ceiling where sellers repeatedly step in" },
        { id: "c", text: "A guarantee that price cannot fall further" },
      ],
      correctAnswer: "a",
      explanation:
        "Support is a floor where buying pressure has repeatedly stopped a decline. It can still break — it's an area of reaction, not a guarantee.",
      beginnerHint: "Think about which side defends a floor.",
      relatedConcept: "Support and Resistance",
    },
    {
      id: "palc-2",
      type: "true-false",
      question:
        "A breakout is confirmed by price closing beyond the level, not just a wick poking through.",
      options: [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ],
      correctAnswer: "true",
      explanation:
        "Judge breakouts by the close. A wick through a level that closes back inside is a fakeout, not a breakout.",
      relatedConcept: "Breakouts",
    },
    {
      id: "palc-3",
      type: "multiple-choice",
      question:
        "Price breaks above resistance, then comes back down and reacts off that same level before rising again. What is this called?",
      options: [
        { id: "a", text: "A break and retest" },
        { id: "b", text: "A fakeout" },
        { id: "c", text: "A range" },
      ],
      correctAnswer: "a",
      explanation:
        "After a break, old resistance often acts as new support. Price tapping it from above before continuing is the retest.",
      beginnerHint: "The old level is being tested from the other side.",
      relatedConcept: "Break and Retest",
    },
    {
      id: "palc-4",
      type: "scenario",
      question:
        "You spot a level price has only touched once. How much weight should you give it?",
      options: [
        { id: "a", text: "Treat it cautiously — one touch is weak evidence" },
        { id: "b", text: "Treat it as the strongest level on the chart" },
        { id: "c", text: "Ignore all levels with fewer than ten touches" },
      ],
      correctAnswer: "a",
      explanation:
        "The more clean reactions a level has, the more it matters. A single touch is weak evidence on its own.",
      relatedConcept: "Support and Resistance",
    },
  ],
}
