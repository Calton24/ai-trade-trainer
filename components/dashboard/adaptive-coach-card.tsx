"use client"

import Link from "next/link"
import { memo } from "react"
import { ArrowRightIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { AdaptiveRecommendation } from "@/lib/skills/types"

export const AdaptiveCoachCard = memo(function AdaptiveCoachCard({
  recommendations,
}: {
  recommendations: AdaptiveRecommendation[]
}) {
  if (recommendations.length === 0) return null

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-6">
      <div className="flex items-center gap-2">
        <SparklesIcon className="size-4 text-primary" />
        <p className="text-sm font-medium">Adaptive Coach</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Never random — always the highest-ROI practice for your weakest skill.
      </p>

      <ul className="mt-4 flex flex-col gap-3">
        {recommendations.map((rec) => (
          <li
            key={rec.skillId}
            className="flex items-start justify-between gap-3 rounded-lg border border-border/50 px-3 py-2.5"
          >
            <div>
              <p className="text-sm font-medium">{rec.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{rec.reason}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0"
              render={<Link href={rec.href} />}
            >
              Practise
            </Button>
          </li>
        ))}
      </ul>

      <Button
        className="mt-4"
        variant="ghost"
        size="sm"
        render={<Link href="/practice" />}
      >
        Open Practice Hub
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
    </div>
  )
})
