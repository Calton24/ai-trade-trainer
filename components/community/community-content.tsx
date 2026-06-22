"use client"

import Link from "next/link"
import { MessageCircleIcon, UsersIcon } from "lucide-react"

import { WaitlistForm } from "@/components/community/community-feed"
import { AppShell } from "@/components/layout/app-shell"
import { exampleDiscussionPrompts, weeklyChallenge } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"

export function CommunityContent() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Beginner Trading Circle
          </h1>
          <p className="text-muted-foreground">
            Community features are coming soon. Join the waitlist to be notified
            when we launch.
          </p>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-2 text-primary">
            <UsersIcon />
            <h3 className="font-medium">Community Preview</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            A supportive space for learners to share chart drills, discuss
            mistakes, and grow together. No fake posts — real community launches
            with Discord integration.
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-6">
          <h2 className="font-medium">Weekly Challenge Preview</h2>
          <p className="mt-2 font-medium">{weeklyChallenge.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {weeklyChallenge.description}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Example challenge — not active yet
          </p>
        </div>

        <div>
          <h2 className="mb-4 font-medium">Example discussion prompts</h2>
          <div className="flex flex-col gap-3">
            {exampleDiscussionPrompts.map((prompt) => (
              <div
                key={prompt}
                className="flex items-start gap-3 rounded-xl border border-dashed border-border/60 bg-card/30 p-4"
              >
                <MessageCircleIcon className="mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Example discussion prompt
                  </p>
                  <p className="mt-1 text-sm">{prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-2 font-medium">Join the waitlist</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Be first in when the Beginner Trading Circle launches on Discord.
          </p>
          <WaitlistForm />
        </div>

        <div className="text-center">
          <Button variant="outline" render={<Link href="/training" />}>
            Practice with Chart Drills while you wait
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
