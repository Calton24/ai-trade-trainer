import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  subtext?: string
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function StatCard({
  label,
  value,
  subtext,
  trend = "neutral",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card/50 p-5 ring-1 ring-white/[0.02]",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold tracking-tight",
          trend === "up" && "text-primary",
          trend === "down" && "text-destructive"
        )}
      >
        {value}
      </p>
      {subtext && (
        <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
      )}
    </div>
  )
}
