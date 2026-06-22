"use client"

import { useState } from "react"
import { MessageCircleIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getDiscussionResponse, quizDiscussionPrompts } from "@/lib/mock-data"

interface QuizDiscussionProps {
  quizId: string
}

export function QuizDiscussion({ quizId }: QuizDiscussionProps) {
  const [activePrompt, setActivePrompt] = useState<string | null>(null)
  const [response, setResponse] = useState<string | null>(null)

  const handlePrompt = (promptId: string) => {
    setActivePrompt(promptId)
    setResponse(getDiscussionResponse(quizId, promptId))
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/50 p-6">
      <div className="flex items-center gap-2">
        <MessageCircleIcon className="text-primary" />
        <h3 className="font-medium">Discuss this quiz with AI Coach</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Tap a prompt to get beginner-friendly explanations. Mock responses for
        now — wire OpenAI later.
      </p>

      <div className="flex flex-wrap gap-2">
        {quizDiscussionPrompts.map((prompt) => (
          <Button
            key={prompt.id}
            variant={activePrompt === prompt.id ? "default" : "outline"}
            size="sm"
            onClick={() => handlePrompt(prompt.id)}
          >
            {prompt.label}
          </Button>
        ))}
      </div>

      {response && (
        <div className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <SparklesIcon className="mt-0.5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            {response}
          </p>
        </div>
      )}
    </div>
  )
}
