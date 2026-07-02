import { cn } from "@/lib/utils"

/** Shared glassmorphism tokens for the onboarding flow. */
export const onboardingGlass = {
  shell:
    "relative min-h-svh overflow-hidden bg-background",
  ambient:
    "pointer-events-none absolute inset-0 overflow-hidden",
  orbPrimary:
    "absolute -left-24 top-0 size-72 rounded-full bg-primary/20 blur-3xl",
  orbSecondary:
    "absolute -right-16 top-40 size-96 rounded-full bg-primary/10 blur-3xl",
  orbBottom:
    "absolute bottom-0 left-1/3 size-80 rounded-full bg-emerald-500/10 blur-3xl",

  header:
    "relative z-10 border-b border-white/10 bg-background/40 backdrop-blur-xl",

  heroCard:
    "relative z-10 rounded-2xl border border-white/10 bg-card/25 p-6 text-center shadow-lg backdrop-blur-xl sm:p-8",

  wizardCard:
    "relative z-10 rounded-2xl border border-white/10 bg-card/30 p-5 shadow-xl backdrop-blur-xl sm:p-6",

  progressHeader:
    "mb-4 flex items-center justify-between gap-3 text-xs",

  progressTrack:
    "relative h-2 w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur-sm",

  progressFill:
    "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/70 via-primary to-primary/90 shadow-[0_0_12px_rgba(var(--primary-rgb,34,197,94),0.35)] transition-[width] duration-500 ease-out",

  savePill:
    "rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-muted-foreground backdrop-blur-sm",

  savePillActive:
    "border-primary/30 bg-primary/10 text-primary",

  stepPanel: "space-y-5",

  field:
    "space-y-2",

  input:
    "border-white/10 bg-white/5 backdrop-blur-sm transition-colors focus-visible:border-primary/40 focus-visible:ring-primary/20 dark:bg-white/5",

  select:
    "flex h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm shadow-sm backdrop-blur-sm outline-none transition-colors focus-visible:border-primary/40 focus-visible:ring-3 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",

  optionChip: (selected: boolean) =>
    cn(
      "rounded-full border px-3 py-1 text-xs transition-all backdrop-blur-sm",
      selected
        ? "border-primary/40 bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20"
        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:bg-white/10"
    ),

  choiceCard: (selected: boolean) =>
    cn(
      "rounded-xl border p-3 text-left text-sm transition-all backdrop-blur-sm",
      selected
        ? "border-primary/40 bg-primary/10 shadow-sm ring-1 ring-primary/25"
        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
    ),

  toggleCard: (checked: boolean) =>
    cn(
      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all backdrop-blur-sm",
      checked
        ? "border-primary/40 bg-primary/10 ring-1 ring-primary/25"
        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
    ),

  summaryCard:
    "space-y-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm",

  summaryRow:
    "flex justify-between gap-4 border-b border-white/10 pb-2 last:border-0 last:pb-0",

  highlightCard:
    "rounded-xl border border-primary/25 bg-primary/10 p-4 backdrop-blur-sm",

  error:
    "rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive backdrop-blur-sm",

  footer:
    "flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:flex-row sm:justify-between",
} as const

export function saveStatusLabel(
  status: "idle" | "draft" | "saved" | "saving" | "error"
): string | null {
  switch (status) {
    case "saving":
      return "Saving…"
    case "saved":
      return "Saved"
    case "draft":
      return "Draft saved"
    case "error":
      return "Save failed"
    default:
      return null
  }
}
