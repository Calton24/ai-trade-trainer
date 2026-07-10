"use client"

import { GraduationCapIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface MentorPanelProps {
  message: string
  className?: string
}

export function MentorPanel({ message, className }: MentorPanelProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 shadow-lg backdrop-blur-sm",
        className
      )}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
        <GraduationCapIcon className="size-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-primary">Your Mentor</p>
        <p className="mt-0.5 text-sm text-foreground/90">{message}</p>
      </div>
    </div>
  )
}
