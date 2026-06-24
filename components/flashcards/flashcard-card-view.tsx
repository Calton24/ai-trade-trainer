"use client"

import { ChartLab } from "@/components/chart-lab/chart-lab"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Flashcard, FlashcardConfidence } from "@/lib/flashcards/types"
import { cn } from "@/lib/utils"

interface FlashcardCardViewProps {
  card: Flashcard
  flipped: boolean
  onFlip: () => void
  selectedOption: string | null
  onSelectOption: (id: string) => void
  showAnswer: boolean
}

export function FlashcardCardView({
  card,
  flipped,
  onFlip,
  selectedOption,
  onSelectOption,
  showAnswer,
}: FlashcardCardViewProps) {
  const isChart =
    card.type === "chart" || card.type === "interactive-chart"

  return (
    <div className="flex min-h-[280px] flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-6">
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary" className="capitalize text-[10px]">
          {card.type.replace("-", " ")}
        </Badge>
        <Badge variant="outline" className="text-[10px] capitalize">
          {card.difficulty}
        </Badge>
      </div>

      <p className="text-lg font-medium leading-relaxed">{card.front}</p>

      {isChart && card.chartScenarioId && (
        <ChartLab
          scenarioId={card.chartScenarioId}
          caption={card.interactiveTask ?? "Synthetic chart — not live data."}
          trackProgress={card.type === "interactive-chart"}
        />
      )}

      {card.type === "multiple-choice" && card.options && !showAnswer && (
        <div className="flex flex-col gap-2">
          {card.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectOption(opt.id)}
              className={cn(
                "rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                selectedOption === opt.id && "border-primary/30 bg-primary/10"
              )}
            >
              {opt.text}
            </button>
          ))}
        </div>
      )}

      {card.type === "true-false" && !showAnswer && (
        <div className="flex gap-2">
          {(["true", "false"] as const).map((val) => (
            <Button
              key={val}
              variant={selectedOption === val ? "default" : "outline"}
              onClick={() => onSelectOption(val)}
              className="flex-1 capitalize"
            >
              {val}
            </Button>
          ))}
        </div>
      )}

      {(card.type === "basic" ||
        card.type === "scenario" ||
        showAnswer ||
        (card.type === "chart" && !card.interactiveTask)) && (
        <>
          {!flipped && card.type !== "multiple-choice" && card.type !== "true-false" && (
            <Button variant="outline" onClick={onFlip} className="w-fit">
              Reveal answer
            </Button>
          )}
          {(flipped || showAnswer) && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-medium text-primary">Answer</p>
              <p className="mt-2 text-sm">{card.back}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {card.explanation}
              </p>
            </div>
          )}
        </>
      )}

      {showAnswer &&
        card.type === "multiple-choice" &&
        card.correctAnswer && (
          <div
            className={cn(
              "rounded-lg border p-4",
              selectedOption === card.correctAnswer
                ? "border-primary/20 bg-primary/5"
                : "border-destructive/20 bg-destructive/5"
            )}
          >
            <p className="text-sm">{card.explanation}</p>
          </div>
        )}
    </div>
  )
}

export function ConfidenceButtons({
  onSelect,
  disabled,
}: {
  onSelect: (c: FlashcardConfidence) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button
        variant="outline"
        className="flex-1 border-destructive/30"
        disabled={disabled}
        onClick={() => onSelect("missed")}
      >
        Missed it <span className="ml-1 text-xs text-muted-foreground">(1)</span>
      </Button>
      <Button
        variant="outline"
        className="flex-1"
        disabled={disabled}
        onClick={() => onSelect("nearly")}
      >
        Nearly <span className="ml-1 text-xs text-muted-foreground">(2)</span>
      </Button>
      <Button
        className="flex-1"
        disabled={disabled}
        onClick={() => onSelect("got_it")}
      >
        Got it <span className="ml-1 text-xs text-muted-foreground">(3)</span>
      </Button>
    </div>
  )
}
