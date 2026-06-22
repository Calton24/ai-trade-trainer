import Link from "next/link"
import {
  BookOpenIcon,
  BrainIcon,
  CalculatorIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  LockIcon,
  PenLineIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSyllabusItemHref } from "@/lib/path-utils"
import type { SyllabusItem } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SyllabusListProps {
  items: SyllabusItem[]
  isItemCompleted?: (itemId: string) => boolean
}

const typeConfig = {
  lesson: { icon: BookOpenIcon, label: "Lesson", color: "text-blue-400" },
  quiz: { icon: BrainIcon, label: "Quiz", color: "text-purple-400" },
  drill: { icon: PenLineIcon, label: "Chart Drill", color: "text-primary" },
  reflection: {
    icon: ClipboardListIcon,
    label: "Reflection",
    color: "text-amber-400",
  },
  exercise: {
    icon: CalculatorIcon,
    label: "Exercise",
    color: "text-cyan-400",
  },
}

function getCtaLabel(item: SyllabusItem, completed: boolean): string {
  if (completed) return "Review"
  if (item.type === "quiz") return "Start Quiz"
  if (item.type === "drill") return "Start Drill"
  if (item.type === "reflection") return "Reflect"
  return "Start"
}

export function SyllabusList({ items, isItemCompleted }: SyllabusListProps) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const config = typeConfig[item.type]
        const Icon = config.icon
        const completed = isItemCompleted?.(item.id) ?? false
        const href = getSyllabusItemHref(item)

        return (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-4 rounded-lg border border-border/60 bg-card/30 px-4 py-3",
              completed && "border-primary/20 bg-primary/5",
              item.locked && "opacity-50"
            )}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/50 text-xs font-mono text-muted-foreground">
              {item.order}
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <Icon className={cn("shrink-0", config.color)} />
                <span className="truncate text-sm font-medium">
                  {item.title}
                </span>
                {completed && (
                  <CheckCircle2Icon className="shrink-0 text-primary" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {config.label}
                </Badge>
                <span>{item.estimatedMinutes} min</span>
              </div>
            </div>

            {item.locked ? (
              <LockIcon className="shrink-0 text-muted-foreground" />
            ) : (
              <Button size="sm" variant="outline" render={<Link href={href} />}>
                {getCtaLabel(item, completed)}
              </Button>
            )}
          </div>
        )
      })}
    </div>
  )
}
