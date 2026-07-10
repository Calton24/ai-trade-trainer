"use client"

import Link from "next/link"
import { memo, useCallback } from "react"
import {
  CheckCircle2Icon,
  CircleIcon,
  ClockIcon,
  GiftIcon,
} from "lucide-react"

import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { DailyTrainingPlan } from "@/lib/skills/types"
import { cn } from "@/lib/utils"

export const DailyTrainingCard = memo(function DailyTrainingCard({
  plan,
}: {
  plan: DailyTrainingPlan
}) {
  const { completeDailyTrainingItem, claimDailyTrainingBonus } = useUserState()

  const toggleItem = useCallback(
    (itemId: string, completed: boolean) => {
      if (!completed) completeDailyTrainingItem(itemId)
    },
    [completeDailyTrainingItem]
  )

  const progress =
    plan.items.length > 0
      ? Math.round((plan.completedCount / plan.items.length) * 100)
      : 0

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Today&apos;s Practice</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Personalised from your weakest skills — highest ROI reps first.
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <ClockIcon className="size-3.5" />
          ~{plan.estimatedMinutes} min
        </div>
      </div>

      <Progress value={progress} className="mt-4 h-2" />

      <ul className="mt-4 flex flex-col gap-2">
        {plan.items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
              item.completed
                ? "border-primary/30 bg-primary/5"
                : "border-border/50"
            )}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id, item.completed)}
              className="shrink-0"
              aria-label={item.completed ? "Completed" : "Mark complete"}
            >
              {item.completed ? (
                <CheckCircle2Icon className="size-4 text-primary" />
              ) : (
                <CircleIcon className="size-4 text-muted-foreground" />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <p className="font-medium">
                {item.label}{" "}
                <span className="font-normal text-muted-foreground">
                  ×{item.count}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="shrink-0"
              render={<Link href={item.href} />}
            >
              Start
            </Button>
          </li>
        ))}
      </ul>

      {plan.allComplete && !plan.bonusClaimed && (
        <Button
          className="mt-4 w-full"
          onClick={() => claimDailyTrainingBonus()}
        >
          <GiftIcon data-icon="inline-start" />
          Claim daily bonus (+{plan.bonusXp} XP)
        </Button>
      )}
      {plan.allComplete && plan.bonusClaimed && (
        <p className="mt-4 text-center text-xs text-primary">
          Daily practice complete — bonus claimed.
        </p>
      )}
    </div>
  )
})
