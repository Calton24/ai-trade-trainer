import type {
  KnowledgeQuestion,
  PillarScoreResult,
  PsychologyScenario,
  ReadinessPillarId,
  RiskScenario,
  TradeSelectionScenario,
  JournalAnalysisScenario,
  StrategyMasteryQuestion,
} from "./types"

export function scoreKnowledgeQuestions(
  questions: KnowledgeQuestion[],
  answers: Record<string, string>
): PillarScoreResult {
  let correct = 0
  const weaknesses: string[] = []

  for (const q of questions) {
    const answer = answers[q.id]?.trim().toLowerCase()
    const expected = q.correctAnswer.trim().toLowerCase()
    if (answer === expected) {
      correct++
    } else {
      weaknesses.push(q.question.slice(0, 60))
    }
  }

  const percent =
    questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0

  return {
    pillarId: "market-knowledge",
    score: correct,
    maxScore: questions.length,
    percent,
    weaknesses: weaknesses.slice(0, 3),
    coachingNote:
      percent >= 80
        ? "Strong conceptual foundation. Keep reinforcing with flashcards."
        : "Review core concepts in Book Lab and Trading Foundations path.",
  }
}

export function scoreChartReading(chartScore: number): PillarScoreResult {
  const percent = Math.round(chartScore)
  const weaknesses: string[] = []
  if (percent < 60) weaknesses.push("Trend identification")
  if (percent < 70) weaknesses.push("Support and resistance marking")
  if (percent < 80) weaknesses.push("Breakout and retest recognition")

  return {
    pillarId: "chart-reading",
    score: percent,
    maxScore: 100,
    percent,
    weaknesses: weaknesses.slice(0, 3),
    coachingNote:
      percent >= 70
        ? "Chart reading is developing well. Practise more complex setups."
        : "Spend time in Chart Lab and Trend Spotter to sharpen pattern recognition.",
  }
}

export function scoreTradeSelection(
  scenario: TradeSelectionScenario,
  takeId: string | null,
  avoidId: string | null,
  reasoning: string
): PillarScoreResult {
  let score = 0
  const weaknesses: string[] = []

  const takeCorrect = takeId === scenario.bestTakeId
  const avoidCorrect = avoidId === scenario.bestAvoidId
  if (takeCorrect) score += 40
  else weaknesses.push("Trade filtering — missed the best setup")
  if (avoidCorrect) score += 40
  else weaknesses.push("Discipline — failed to avoid poor setup")

  const reasoningScore = scoreReasoningQuality(reasoning)
  score += reasoningScore
  if (reasoningScore < 15) weaknesses.push("Trade justification quality")

  const percent = Math.min(100, score)

  return {
    pillarId: "trade-selection",
    score: percent,
    maxScore: 100,
    percent,
    weaknesses,
    coachingNote:
      percent >= 70
        ? "Good filtering instincts. Keep asking 'why this setup?' before every trade."
        : "Focus on trend alignment and risk-reward before entry. Quality over quantity.",
  }
}

function scoreReasoningQuality(reasoning: string): number {
  const text = reasoning.trim().toLowerCase()
  if (text.length < 20) return 5
  const keywords = [
    "trend",
    "risk",
    "reward",
    "structure",
    "support",
    "resistance",
    "breakout",
    "retest",
    "stop",
    "target",
    "rr",
    "r:r",
    "discipline",
    "skip",
    "avoid",
    "quality",
  ]
  const hits = keywords.filter((k) => text.includes(k)).length
  if (hits >= 4) return 20
  if (hits >= 2) return 15
  if (hits >= 1) return 10
  return 8
}

export function scoreRiskScenario(
  scenario: RiskScenario,
  answer: string
): { correct: boolean; points: number } {
  if (scenario.correctOptionId) {
    return {
      correct: answer === scenario.correctOptionId,
      points: answer === scenario.correctOptionId ? 1 : 0,
    }
  }

  const numericAnswer = parseFloat(answer.replace(/[£$,]/g, ""))
  const expected =
    typeof scenario.correctAnswer === "number"
      ? scenario.correctAnswer
      : parseFloat(String(scenario.correctAnswer).replace(/[£$,]/g, ""))

  if (isNaN(numericAnswer) || isNaN(expected)) {
    return { correct: answer.trim() === String(scenario.correctAnswer), points: 0 }
  }

  const tolerance = scenario.tolerance ?? expected * 0.02
  const correct = Math.abs(numericAnswer - expected) <= tolerance
  return { correct, points: correct ? 1 : 0 }
}

export function scoreRiskManagement(
  scenarios: RiskScenario[],
  answers: Record<string, string>
): PillarScoreResult {
  let correct = 0
  const weaknesses: string[] = []

  for (const s of scenarios) {
    const result = scoreRiskScenario(s, answers[s.id] ?? "")
    if (result.correct) correct++
    else weaknesses.push(s.prompt.slice(0, 50))
  }

  const percent =
    scenarios.length > 0 ? Math.round((correct / scenarios.length) * 100) : 0

  return {
    pillarId: "risk-management",
    score: correct,
    maxScore: scenarios.length,
    percent,
    weaknesses: weaknesses.slice(0, 3),
    coachingNote:
      percent >= 80
        ? "Solid risk management. Protect this edge — it's what keeps you in the game."
        : "Review position sizing and drawdown rules in Book Lab risk chapters.",
  }
}

export function scorePsychology(
  scenarios: PsychologyScenario[],
  answers: Record<string, string>
): PillarScoreResult {
  let totalScore = 0
  const weaknesses: string[] = []

  for (const s of scenarios) {
    const selected = s.options.find((o) => o.id === answers[s.id])
    if (selected) {
      totalScore += selected.score
      if (selected.id !== s.bestOptionId) {
        weaknesses.push(s.traits[0] ?? "Emotional discipline")
      }
    }
  }

  const maxScore = scenarios.length * 100
  const percent =
    scenarios.length > 0 ? Math.round((totalScore / maxScore) * 100) : 0

  return {
    pillarId: "psychology",
    score: totalScore,
    maxScore,
    percent,
    weaknesses: [...new Set(weaknesses)].slice(0, 3),
    coachingNote:
      percent >= 70
        ? "Process-oriented mindset. Keep following your plan through drawdowns."
        : "Psychology is often the biggest gap. Review emotional discipline content.",
  }
}

export function scoreJournalAnalysis(
  scenario: JournalAnalysisScenario,
  selectedMistakes: string[],
  selectedPatterns: string[],
  improvement: string
): PillarScoreResult {
  let score = 0
  const weaknesses: string[] = []

  const mistakeHits = selectedMistakes.filter((m) =>
    scenario.correctMistakes.includes(m)
  ).length
  const mistakeScore = Math.round(
    (mistakeHits / scenario.correctMistakes.length) * 40
  )
  score += mistakeScore
  if (mistakeScore < 30) weaknesses.push("Mistake identification")

  const patternHits = selectedPatterns.filter((p) =>
    scenario.correctPatterns.includes(p)
  ).length
  const patternScore = Math.round(
    (patternHits / scenario.correctPatterns.length) * 30
  )
  score += patternScore
  if (patternScore < 20) weaknesses.push("Pattern recognition in journals")

  const improvementScore = scoreReasoningQuality(improvement)
  score += Math.min(30, improvementScore * 1.5)
  if (improvementScore < 15) weaknesses.push("Actionable improvement planning")

  const percent = Math.min(100, Math.round(score))

  return {
    pillarId: "journal-analysis",
    score: percent,
    maxScore: 100,
    percent,
    weaknesses,
    coachingNote:
      percent >= 70
        ? "Strong journal review skills. Apply this to your own trades weekly."
        : "Look for repeating mistakes: overtrading, revenge trading, and poor R:R.",
  }
}

export function scoreStrategyMastery(
  questions: StrategyMasteryQuestion[],
  answers: Record<string, string>
): PillarScoreResult {
  let correct = 0
  const weaknesses: string[] = []

  for (const q of questions) {
    if (answers[q.id] === q.correctAnswer) correct++
    else weaknesses.push(q.strategySlug)
  }

  const percent =
    questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0

  return {
    pillarId: "strategy-mastery",
    score: correct,
    maxScore: questions.length,
    percent,
    weaknesses: [...new Set(weaknesses)].slice(0, 3),
    coachingNote:
      percent >= 80
        ? "Strategy mastery threshold met. Continue practising in Strategy Wiki."
        : "Review entry rules, invalidation, and stop placement for each strategy.",
  }
}

export function computeOverallReadiness(
  pillarPercents: Partial<Record<ReadinessPillarId, number>>
): number {
  const scores = Object.values(pillarPercents).filter(
    (s): s is number => s !== undefined
  )
  if (scores.length === 0) return 0
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

export function findWeakestPillar(
  pillarPercents: Record<ReadinessPillarId, number>
): ReadinessPillarId {
  let weakest: ReadinessPillarId = "market-knowledge"
  let lowest = 101
  for (const [id, score] of Object.entries(pillarPercents)) {
    if (score < lowest) {
      lowest = score
      weakest = id as ReadinessPillarId
    }
  }
  return weakest
}

export function findStrongestPillar(
  pillarPercents: Record<ReadinessPillarId, number>
): ReadinessPillarId {
  let strongest: ReadinessPillarId = "market-knowledge"
  let highest = -1
  for (const [id, score] of Object.entries(pillarPercents)) {
    if (score > highest) {
      highest = score
      strongest = id as ReadinessPillarId
    }
  }
  return strongest
}
