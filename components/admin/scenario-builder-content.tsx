"use client"

import { useCallback, useMemo, useState } from "react"
import { CheckIcon, CopyIcon, PlayIcon } from "lucide-react"

import { ChartReplayControls } from "@/components/simulator/chart-replay-controls"
import { useChartReplay } from "@/components/simulator/use-chart-replay"
import { ExecutionChart } from "@/components/execution-lab/execution-chart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { createDefaultPlan } from "@/lib/execution-lab/default-plan"
import { validateExecution } from "@/lib/execution-lab/scoring"
import { sliceVisibleCandles } from "@/lib/simulator/replay"
import { exportScenarioTypeScript } from "@/lib/scenario-builder/export"
import { parseOhlcCsv, candlesToCsv } from "@/lib/scenario-builder/parse-csv"
import {
  type BuilderAnnotation,
  type BuilderAnnotationTool,
  type ScenarioDraft,
  CATEGORY_OPTIONS,
  STRATEGY_OPTIONS,
  SYMBOL_PRESETS,
  buildExecutionScenarioFromDraft,
  createEmptyDraft,
} from "@/lib/scenario-builder/types"
import {
  BUILDER_TEMPLATES,
  applyTemplateWithCandles,
  generateSampleCandles,
  type BuilderTemplateId,
} from "@/lib/scenario-builder/templates"
import type { StrategyChoice, TradeDirection } from "@/lib/execution-lab/types"
import { cn } from "@/lib/utils"

const ANNOTATION_TOOLS: { id: BuilderAnnotationTool; label: string }[] = [
  { id: "pointer", label: "Select" },
  { id: "swing-high", label: "Swing High" },
  { id: "swing-low", label: "Swing Low" },
  { id: "liquidity", label: "Liquidity" },
  { id: "support", label: "Support" },
  { id: "resistance", label: "Resistance" },
  { id: "entry", label: "Entry" },
  { id: "stop", label: "Stop" },
  { id: "target", label: "Target" },
  { id: "decision", label: "Decision" },
]

interface ScenarioBuilderContentProps {
  adminEmail: string
}

export function ScenarioBuilderContent({ adminEmail }: ScenarioBuilderContentProps) {
  const [draft, setDraft] = useState<ScenarioDraft>(createEmptyDraft)
  const [csvText, setCsvText] = useState("")
  const [csvErrors, setCsvErrors] = useState<string[]>([])
  const [csvWarnings, setCsvWarnings] = useState<string[]>([])
  const [activeTool, setActiveTool] = useState<BuilderAnnotationTool>("pointer")
  const [copied, setCopied] = useState(false)
  const [validationPreview, setValidationPreview] = useState<string | null>(null)

  const scenario = useMemo(() => buildExecutionScenarioFromDraft(draft), [draft])
  const exportCode = useMemo(() => exportScenarioTypeScript(draft), [draft])

  const replay = useChartReplay({
    minIndex: 0,
    maxIndex: Math.max(0, (scenario?.replayEndIndex ?? 0)),
    initialIndex: scenario?.pauseIndex ?? 0,
  })

  const visibleCandles = scenario
    ? sliceVisibleCandles(scenario.chart.candles, replay.currentIndex)
    : []

  const update = useCallback((patch: Partial<ScenarioDraft>) => {
    setDraft((d) => ({ ...d, ...patch }))
  }, [])

  const loadTemplate = (templateId: BuilderTemplateId) => {
    const next = applyTemplateWithCandles(templateId)
    setDraft(next)
    setCsvText(candlesToCsv(next.candles))
    setCsvErrors([])
    setCsvWarnings([])
    setValidationPreview(null)
    replay.setCurrentIndex(next.pauseIndex)
  }

  const regenerateCandles = () => {
    const template = BUILDER_TEMPLATES.find(
      (t) => t.patch.category === draft.category || t.patch.behaviour === draft.behaviour
    )
    const kind = template?.kind ?? "uptrend"
    const candles = generateSampleCandles(kind, draft.symbol, draft.id)
    const pauseIndex = Math.min(draft.pauseIndex, candles.length - 1)
    const c = candles[pauseIndex] ?? candles[candles.length - 1]
    update({ candles, pauseIndex, idealEntry: c.close })
    setCsvText(candlesToCsv(candles))
    setCsvErrors([])
    setCsvWarnings([])
  }

  const slugifyTitle = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40)

  const parseCsv = () => {
    const result = parseOhlcCsv(csvText)
    setCsvErrors(result.errors)
    setCsvWarnings(result.warnings)
    if (result.candles.length > 0) {
      const pause = Math.min(draft.pauseIndex, result.candles.length - 1)
      const c = result.candles[pause] ?? result.candles[result.candles.length - 1]
      update({
        candles: result.candles,
        pauseIndex: pause || Math.floor(result.candles.length * 0.72),
        idealEntry: draft.idealEntry || c.close,
      })
    }
  }

  const handleChartClick = (index: number, price: number) => {
    if (activeTool === "pointer") return

    if (activeTool === "decision") {
      update({ pauseIndex: index })
      return
    }
    if (activeTool === "entry") {
      update({ idealEntry: price, pauseIndex: index })
      return
    }
    if (activeTool === "stop") {
      update({ idealStop: price })
      return
    }
    if (activeTool === "target") {
      update({ idealTarget: price })
      return
    }

    const ann: BuilderAnnotation = {
      id: `ann-${Date.now()}`,
      tool: activeTool,
      index,
      price,
    }
    update({ annotations: [...draft.annotations, ann] })
  }

  const chartClickMode =
    activeTool === "swing-high"
      ? "swing-high"
      : activeTool === "swing-low"
        ? "swing-low"
        : activeTool !== "pointer"
          ? "zone"
          : null

  const markers = draft.annotations
    .filter((a) => a.tool === "swing-high" || a.tool === "swing-low")
    .map((a) => ({
      index: a.index,
      price: a.price,
      kind: a.tool === "swing-high" ? ("swing-high" as const) : ("swing-low" as const),
    }))

  const testValidation = () => {
    if (!scenario) return
    const plan = {
      ...createDefaultPlan(scenario),
      direction: draft.idealDirection,
      strategy: draft.bestStrategy,
      entry: draft.idealEntry,
      stop: draft.idealStop,
      target: draft.idealTarget,
      confidence: 75,
    }
    const result = validateExecution(scenario, plan)
    setValidationPreview(
      `Score ${result.score}/100 — ${result.passed ? "PASS" : "REVIEW"}\n` +
        result.feedback.map((f) => `${f.ok ? "✓" : "✗"} ${f.message}`).join("\n")
    )
  }

  const copyExport = async () => {
    await navigator.clipboard.writeText(exportCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const applySymbolPreset = (symbol: string) => {
    const preset = SYMBOL_PRESETS.find((p) => p.symbol === symbol)
    if (preset) {
      update({
        symbol,
        market: symbol,
        pipSize: preset.pipSize,
        pipValuePerLot: preset.pipValue,
      })
    } else {
      update({ symbol, market: symbol })
    }
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 p-4 pb-16 md:p-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Internal · Admin only
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Scenario Builder</h1>
        <p className="text-sm text-muted-foreground">
          Create Execution Lab scenarios in minutes. Signed in as {adminEmail}.
        </p>
      </div>

      <section className="rounded-xl border border-primary/30 bg-primary/5 p-4">
        <h2 className="text-sm font-medium">Quick start (&lt; 5 min)</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Load a template with sample OHLC, then tweak metadata and export. One click =
          form + candles + levels pre-filled.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {BUILDER_TEMPLATES.map((t) => (
            <Button key={t.id} size="sm" variant="outline" onClick={() => loadTemplate(t.id)}>
              {t.label}
            </Button>
          ))}
          {draft.candles.length > 0 && (
            <Button size="sm" variant="ghost" onClick={regenerateCandles}>
              Regenerate OHLC
            </Button>
          )}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-border/60 bg-card/50 p-5">
          <h2 className="font-medium">Scenario metadata</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="ID (slug)">
              <Input
                value={draft.id}
                onChange={(e) => update({ id: e.target.value })}
                className="font-mono text-sm"
              />
            </Field>
            <Field label="Title">
              <Input
                value={draft.title}
                onChange={(e) => update({ title: e.target.value })}
                onBlur={() => {
                  if (draft.id.startsWith("custom-scenario") || draft.id.startsWith("pack-")) {
                    update({ id: `pack-${slugifyTitle(draft.title)}` })
                  }
                }}
              />
            </Field>
          </div>

          <Field label="Description">
            <Textarea
              value={draft.description}
              onChange={(e) => update({ description: e.target.value })}
              rows={2}
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Symbol">
              <select
                className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                value={draft.symbol}
                onChange={(e) => applySymbolPreset(e.target.value)}
              >
                {SYMBOL_PRESETS.map((p) => (
                  <option key={p.symbol} value={p.symbol}>
                    {p.symbol}
                  </option>
                ))}
                <option value="CUSTOM">Custom…</option>
              </select>
            </Field>
            <Field label="Timeframe">
              <Input
                value={draft.timeframe}
                onChange={(e) => update({ timeframe: e.target.value })}
              />
            </Field>
            <Field label="Session">
              <Input
                value={draft.session}
                onChange={(e) => update({ session: e.target.value })}
                placeholder="London"
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Difficulty">
              <select
                className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                value={draft.difficulty}
                onChange={(e) =>
                  update({ difficulty: e.target.value as ScenarioDraft["difficulty"] })
                }
              >
                {(["Beginner", "Intermediate", "Advanced", "Professional"] as const).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Category">
              <select
                className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                value={draft.category}
                onChange={(e) =>
                  update({ category: e.target.value as ScenarioDraft["category"] })
                }
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Behaviour tag">
              <Input
                value={draft.behaviour}
                onChange={(e) => update({ behaviour: e.target.value })}
                placeholder="reversal"
              />
            </Field>
            <Field label="Subcategory">
              <Input
                value={draft.subcategory}
                onChange={(e) => update({ subcategory: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Tags (comma-separated)">
            <Input
              value={draft.tags.join(", ")}
              onChange={(e) =>
                update({
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Correct trend">
              <select
                className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                value={draft.correctTrend}
                onChange={(e) =>
                  update({ correctTrend: e.target.value as ScenarioDraft["correctTrend"] })
                }
              >
                <option value="uptrend">Uptrend</option>
                <option value="downtrend">Downtrend</option>
                <option value="range">Range</option>
              </select>
            </Field>
            <Field label="Ideal direction">
              <select
                className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                value={draft.idealDirection}
                onChange={(e) =>
                  update({ idealDirection: e.target.value as TradeDirection })
                }
              >
                {(["buy", "sell", "wait", "no-trade"] as const).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Best strategy">
            <div className="flex flex-wrap gap-1.5">
              {STRATEGY_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => update({ bestStrategy: s })}
                  className={cn(
                    "rounded-md border px-2 py-1 text-xs",
                    draft.bestStrategy === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Strategy options (multi)">
            <div className="flex flex-wrap gap-1.5">
              {STRATEGY_OPTIONS.map((s) => {
                const on = draft.strategyOptions.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      const next = on
                        ? draft.strategyOptions.filter((x) => x !== s)
                        : [...draft.strategyOptions, s]
                      update({ strategyOptions: next as StrategyChoice[] })
                    }}
                    className={cn(
                      "rounded-md border px-2 py-1 text-xs",
                      on ? "border-primary bg-primary/10 text-primary" : "border-border/60"
                    )}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </Field>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.noTradeValid}
              onChange={(e) => update({ noTradeValid: e.target.checked })}
            />
            No-trade is a valid answer
          </label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field label="Ideal entry">
              <Input
                type="number"
                step="any"
                value={draft.idealEntry || ""}
                onChange={(e) => update({ idealEntry: Number(e.target.value) })}
              />
            </Field>
            <Field label="Ideal stop">
              <Input
                type="number"
                step="any"
                value={draft.idealStop || ""}
                onChange={(e) => update({ idealStop: Number(e.target.value) })}
              />
            </Field>
            <Field label="Ideal target">
              <Input
                type="number"
                step="any"
                value={draft.idealTarget || ""}
                onChange={(e) => update({ idealTarget: Number(e.target.value) })}
              />
            </Field>
            <Field label="Decision candle #">
              <Input
                type="number"
                min={1}
                value={draft.pauseIndex + 1}
                onChange={(e) =>
                  update({ pauseIndex: Math.max(0, Number(e.target.value) - 1) })
                }
              />
            </Field>
          </div>

          <Field label="Mentor hints (one per line)">
            <Textarea
              value={draft.hints.join("\n")}
              onChange={(e) =>
                update({ hints: e.target.value.split("\n").filter((l) => l.trim()) })
              }
              rows={3}
            />
          </Field>

          <Field label="Common mistakes (one per line)">
            <Textarea
              value={draft.commonMistakes.join("\n")}
              onChange={(e) =>
                update({
                  commonMistakes: e.target.value.split("\n").filter((l) => l.trim()),
                })
              }
              rows={2}
            />
          </Field>

          <Field label="Journal prompt">
            <Input
              value={draft.journalPrompt}
              onChange={(e) => update({ journalPrompt: e.target.value })}
            />
          </Field>
        </section>

        <section className="space-y-4 rounded-xl border border-border/60 bg-card/50 p-5">
          <h2 className="font-medium">OHLC data (CSV)</h2>
          <p className="text-xs text-muted-foreground">
            Paste CSV with columns: time, open, high, low, close
          </p>
          <Textarea
            className="min-h-[160px] font-mono text-xs"
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={`time,open,high,low,close\n0,1.0850,1.0855,1.0848,1.0852`}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={parseCsv}>
              Parse & preview
            </Button>
            {draft.candles.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCsvText(candlesToCsv(draft.candles))}
              >
                Export CSV
              </Button>
            )}
          </div>
          {csvErrors.length > 0 && (
            <ul className="text-xs text-destructive">
              {csvErrors.map((e) => (
                <li key={e}>· {e}</li>
              ))}
            </ul>
          )}
          {csvWarnings.map((w) => (
            <p key={w} className="text-xs text-amber-500">
              {w}
            </p>
          ))}
          {draft.candles.length > 0 && (
            <Badge variant="outline">{draft.candles.length} candles loaded</Badge>
          )}
        </section>
      </div>

      <section className="space-y-4 rounded-xl border border-border/60 bg-card/50 p-5">
        <h2 className="font-medium">Annotations</h2>
        <div className="flex flex-wrap gap-1.5">
          {ANNOTATION_TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTool(t.id)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-xs",
                activeTool === t.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/60 text-muted-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Click the chart to place annotations. Decision / Entry also set pause index and ideal
          levels.
        </p>
        {draft.annotations.length > 0 && (
          <ul className="text-xs text-muted-foreground">
            {draft.annotations.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-2 py-0.5">
                <span>
                  {a.tool} @ #{a.index + 1} — {a.price}
                </span>
                <button
                  type="button"
                  className="text-destructive"
                  onClick={() =>
                    update({ annotations: draft.annotations.filter((x) => x.id !== a.id) })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4 rounded-xl border border-primary/30 bg-card/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-medium">Preview</h2>
          {scenario && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={testValidation}>
                Test validator
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => replay.setCurrentIndex(scenario.pauseIndex)}
              >
                <PlayIcon className="size-3.5" data-icon="inline-start" />
                Jump to decision
              </Button>
            </div>
          )}
        </div>

        {!scenario ? (
          <p className="text-sm text-muted-foreground">
            Load at least 10 candles via CSV to preview.
          </p>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg border border-border/60">
              <ExecutionChart
                candles={visibleCandles}
                allCandles={scenario.chart.candles}
                levels={{
                  entry: draft.idealEntry,
                  stop: draft.idealStop,
                  target: draft.idealTarget,
                }}
                direction={
                  draft.idealDirection === "buy" || draft.idealDirection === "sell"
                    ? draft.idealDirection
                    : "wait"
                }
                onLevelsChange={(l) =>
                  update({ idealEntry: l.entry, idealStop: l.stop, idealTarget: l.target })
                }
                showLevels
                height={400}
                clickMode={chartClickMode}
                onChartClick={(point) => handleChartClick(point.index, point.price)}
                markers={markers}
              />
            </div>
            <ChartReplayControls
              isPlaying={replay.isPlaying}
              speed={replay.speed}
              currentIndex={replay.currentIndex}
              maxIndex={scenario.replayEndIndex}
              minIndex={0}
              onPlay={replay.play}
              onPause={replay.pause}
              onNext={replay.next}
              onPrev={replay.prev}
              onReset={() => replay.setCurrentIndex(scenario.pauseIndex)}
              onSpeedChange={replay.setSpeed}
            />
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>Decision: candle {scenario.pauseIndex + 1}</span>
              <span>·</span>
              <span>{draft.hints.length} hints</span>
            </div>
            {draft.hints.length > 0 && (
              <div className="rounded-lg border border-border/60 bg-background/40 p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Academy hints preview
                </p>
                <ol className="list-decimal space-y-1 pl-4 text-sm">
                  {draft.hints.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ol>
              </div>
            )}
            {validationPreview && (
              <pre className="whitespace-pre-wrap rounded-lg bg-background/60 p-3 text-xs">
                {validationPreview}
              </pre>
            )}
          </>
        )}
      </section>

      <section className="space-y-4 rounded-xl border border-border/60 bg-card/50 p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-medium">Export TypeScript</h2>
          <Button size="sm" onClick={copyExport} disabled={draft.candles.length < 10}>
            {copied ? (
              <>
                <CheckIcon className="size-3.5" data-icon="inline-start" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon className="size-3.5" data-icon="inline-start" />
                Copy code
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Paste into <code className="text-primary">content/execution-lab/</code> and register in
          ALL_EXECUTION_SCENARIOS. No database persistence in v1.
        </p>
        <pre className="max-h-[420px] overflow-auto rounded-lg bg-background/80 p-4 font-mono text-[11px] leading-relaxed">
          {exportCode}
        </pre>
      </section>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  )
}
