"use client"

import { useState } from "react"

import { useUserState } from "@/components/providers/user-state-provider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { BookLabConcept } from "@/lib/book-lab/types"

interface BookLabInlineReflectionProps {
  concept: BookLabConcept
}

export function BookLabInlineReflection({ concept }: BookLabInlineReflectionProps) {
  const { saveBookReflectionEntry } = useUserState()
  const [reflection, setReflection] = useState("")
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (!reflection.trim() || saved) return
    saveBookReflectionEntry({
      conceptId: concept.id,
      conceptTitle: concept.title,
      note: reflection,
      confidenceRating: confidence,
      mistakeTag: "None",
      journal: {
        source: "book-lab",
        conceptTitle: concept.title,
        drillType: "reflection",
        setupPracticed: `${concept.title} — reflection`,
        marksSummary: concept.reflectionPrompt,
        aiFeedbackSummary: "Reflection saved from Book Lab concept page.",
        confidenceRating: confidence,
        mistakeTag: "None",
        personalNote: reflection,
      },
    })
    setSaved(true)
  }

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder="Write your reflection..."
        rows={3}
        disabled={saved}
      />
      <div>
        <Label className="text-xs text-muted-foreground">Confidence</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {([1, 2, 3, 4, 5] as const).map((n) => (
            <Button
              key={n}
              size="sm"
              variant={confidence === n ? "default" : "outline"}
              onClick={() => setConfidence(n)}
              disabled={saved}
            >
              {n}
            </Button>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={handleSave}
        disabled={!reflection.trim() || saved}
      >
        {saved ? "Saved to Journal" : "Save reflection to Journal"}
      </Button>
    </div>
  )
}
