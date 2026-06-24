export const STRATEGY_WIKI_DISCLAIMER =
  "Strategy Wiki is for education and simulated practice only. It does not provide financial advice, live trading signals, or profit guarantees."

export function getStrategyChallengeDeck(
  strategyId: string,
  chartScenarioIds: string[],
  count = 10
): { id: string; chartScenarioId: string; setupPresent: boolean }[] {
  const pool = chartScenarioIds.length > 0 ? chartScenarioIds : ["demo-trend-range"]
  const items: { id: string; chartScenarioId: string; setupPresent: boolean }[] = []
  for (let i = 0; i < count; i++) {
    const chartScenarioId = pool[i % pool.length]
    items.push({
      id: `${strategyId}-challenge-${i}`,
      chartScenarioId,
      setupPresent: i % 3 !== 2,
    })
  }
  return items
}
