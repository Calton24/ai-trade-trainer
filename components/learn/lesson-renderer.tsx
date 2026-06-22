"use client"

import {
  AlertTriangleIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  LightbulbIcon,
  ListChecksIcon,
  SparklesIcon,
} from "lucide-react"

import { ChartLab } from "@/components/chart-lab/chart-lab"
import { TrainingChart } from "@/components/training/training-chart"
import { generateMockCandles } from "@/lib/mock-data"
import type { ContentBlock } from "@/lib/course/types"
import { cn } from "@/lib/utils"

interface LessonRendererProps {
  blocks: ContentBlock[]
  showChart?: boolean
}

function ChecklistBlock({ block }: { block: ContentBlock }) {
  const items = block.metadata?.items
  const list = Array.isArray(items) ? items : []
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <div className="flex items-center gap-2 text-sm font-medium">
        <ListChecksIcon className="text-primary" />
        {block.content}
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {list.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <CheckCircle2Icon className="mt-0.5 shrink-0 text-primary/60" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function CalloutBlock({ block }: { block: ContentBlock }) {
  const variant = block.metadata?.variant ?? "tip"
  const styles = {
    "key-idea": "border-primary/20 bg-primary/5 text-primary",
    mistake: "border-destructive/20 bg-destructive/5 text-destructive",
    tip: "border-border/60 bg-muted/30 text-muted-foreground",
  }[variant as string] ?? "border-border/60 bg-muted/30"

  const Icon =
    variant === "key-idea"
      ? LightbulbIcon
      : variant === "mistake"
        ? AlertTriangleIcon
        : SparklesIcon

  const label =
    variant === "key-idea"
      ? "Key idea"
      : variant === "mistake"
        ? "Common beginner mistake"
        : "Tip"

  return (
    <div className={cn("flex gap-3 rounded-xl border p-5", styles)}>
      <Icon className="mt-0.5 shrink-0" />
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-sm leading-relaxed opacity-90">{block.content}</p>
      </div>
    </div>
  )
}

export function LessonRenderer({ blocks, showChart = true }: LessonRendererProps) {
  const chartBlocks = blocks.filter((b) => b.type === "chart-example")
  const chartCandles = generateMockCandles(35)

  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={block.id} className="text-xl font-semibold tracking-tight">
                {block.content}
              </h2>
            )
          case "paragraph":
            return (
              <p
                key={block.id}
                className="leading-relaxed text-muted-foreground"
              >
                {block.content}
              </p>
            )
          case "definition":
            return (
              <div
                key={block.id}
                className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3"
              >
                <p className="text-sm font-medium">
                  {block.metadata?.term ?? "Term"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {block.content}
                </p>
              </div>
            )
          case "example":
            return (
              <div
                key={block.id}
                className="rounded-xl border border-border/60 bg-card/50 p-4"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  Example
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {block.content}
                </p>
              </div>
            )
          case "callout":
            return <CalloutBlock key={block.id} block={block} />
          case "checklist":
            return <ChecklistBlock key={block.id} block={block} />
          case "summary":
            return (
              <div
                key={block.id}
                className="rounded-xl border border-primary/20 bg-primary/5 p-5"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <BookOpenIcon />
                  Summary
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {block.content}
                </p>
              </div>
            )
          case "safety-note":
            return (
              <div
                key={block.id}
                className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-muted-foreground"
              >
                {block.content}
              </div>
            )
          case "interactive-question":
            return (
              <div
                key={block.id}
                className="rounded-xl border border-border/60 bg-card/50 p-5"
              >
                <p className="font-medium">{block.content}</p>
                {block.metadata?.hint && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Hint: {block.metadata.hint}
                  </p>
                )}
                {block.metadata?.answer && (
                  <p className="mt-3 text-sm text-primary">
                    Answer: {block.metadata.answer}
                  </p>
                )}
              </div>
            )
          case "chart-demo":
          case "chart-lab":
          case "interactive-chart-question":
            return block.scenarioId ? (
              <ChartLab
                key={block.id}
                scenarioId={block.scenarioId}
                caption={block.content || undefined}
              />
            ) : null
          case "chart-example":
            if (!showChart) return null
            if (block.scenarioId) {
              return (
                <ChartLab
                  key={block.id}
                  scenarioId={block.scenarioId}
                  caption={block.content || undefined}
                />
              )
            }
            return (
              <div
                key={block.id}
                className="overflow-hidden rounded-xl border border-border/60 bg-card/50"
              >
                <div className="border-b border-border/60 px-4 py-3">
                  <p className="text-sm font-medium">Chart example</p>
                  <p className="text-xs text-muted-foreground">{block.content}</p>
                </div>
                <TrainingChart candles={chartCandles} readOnly />
              </div>
            )
          default:
            return (
              <p key={block.id} className="text-sm text-muted-foreground">
                {block.content}
              </p>
            )
        }
      })}

      {showChart &&
        chartBlocks.length === 0 &&
        blocks.some((b) => b.type === "paragraph") && null}
    </div>
  )
}
