"use client"

import { GraduationCapIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type MentorTone = "neutral" | "encouraging" | "coaching"

interface MentorPanelProps {
  message: string
  className?: string
  tone?: MentorTone
}

const toneStyles: Record<MentorTone, string> = {
  neutral: "border-primary/25 bg-primary/5",
  encouraging: "border-primary/35 bg-primary/10",
  coaching: "border-amber-500/30 bg-amber-500/5",
}

export function MentorPanel({
  message,
  className,
  tone = "neutral",
}: MentorPanelProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm transition-colors duration-200",
        toneStyles[tone],
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="Mentor guidance"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
        <GraduationCapIcon className="size-4 text-primary" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-primary">Your Mentor</p>
        <p key={message} className="app-fade-in mt-0.5 text-sm text-foreground/90">
          {message}
        </p>
      </div>
    </div>
  )
}
