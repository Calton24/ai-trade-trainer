"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface SimulatorJournalFormProps {
  thesis: string
  observation: string
  improvement: string
  onThesisChange: (v: string) => void
  onObservationChange: (v: string) => void
  onImprovementChange: (v: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export function SimulatorJournalForm({
  thesis,
  observation,
  improvement,
  onThesisChange,
  onObservationChange,
  onImprovementChange,
  onSubmit,
  disabled,
}: SimulatorJournalFormProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card/50 p-4">
      <p className="text-sm font-medium">Trade Journal</p>
      <div className="space-y-2">
        <Label htmlFor="thesis">What was your thesis?</Label>
        <Textarea
          id="thesis"
          value={thesis}
          onChange={(e) => onThesisChange(e.target.value)}
          placeholder="Why did you take or skip this trade?"
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="observation">What did you see?</Label>
        <Textarea
          id="observation"
          value={observation}
          onChange={(e) => onObservationChange(e.target.value)}
          placeholder="Key levels, structure, momentum..."
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="improvement">What would you improve?</Label>
        <Textarea
          id="improvement"
          value={improvement}
          onChange={(e) => onImprovementChange(e.target.value)}
          placeholder="Execution, patience, risk..."
          rows={2}
        />
      </div>
      <Button onClick={onSubmit} disabled={disabled || thesis.length < 10}>
        Save & Complete Session
      </Button>
    </div>
  )
}
