import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function StatsGridSkeleton({
  count = 4,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/60 bg-card/50 p-4"
        >
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-8 w-16" />
          <Skeleton className="mt-2 h-3 w-24" />
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card/50 p-5",
        className
      )}
    >
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-3 h-6 w-48" />
      <Skeleton className="mt-4 h-20 w-full" />
      <Skeleton className="mt-4 h-9 w-28" />
    </div>
  )
}

export function TableSkeleton({
  rows = 5,
  cols = 6,
}: {
  rows?: number
  cols?: number
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <div className="border-b border-border/60 bg-muted/30 px-4 py-3">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-16" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="flex gap-4 border-b border-border/40 px-4 py-3 last:border-0"
        >
          {Array.from({ length: cols }).map((_, col) => (
            <Skeleton key={col} className="h-4 w-full max-w-[80px]" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function DashboardHeroSkeleton() {
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-6">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-3 h-8 w-64" />
      <Skeleton className="mt-2 h-4 w-80 max-w-full" />
      <div className="mt-5 flex gap-3">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  )
}
