import Link from "next/link"
import { ArrowRightIcon, MessageCircleIcon, UsersIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { exampleDiscussionPrompts, weeklyChallenge } from "@/lib/mock-data"

export function CommunityPreview() {
  return (
    <section className="border-y border-border/60 bg-card/20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <p className="text-sm font-medium text-primary">
              Community preview
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Learn alongside other beginners
            </h2>
            <p className="text-muted-foreground">
              The Beginner Trading Circle is coming soon. Join the Discord
              waitlist to share drills, discuss mistakes, and join weekly
              challenges when we launch.
            </p>
            <Button className="w-fit" render={<Link href="/community" />}>
              Join Waitlist
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-primary">
                <UsersIcon />
                <span className="text-sm font-medium">
                  Weekly Challenge Preview
                </span>
              </div>
              <p className="mt-2 font-medium">{weeklyChallenge.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {weeklyChallenge.description}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Example challenge — not active yet
              </p>
            </div>
            {exampleDiscussionPrompts.slice(0, 2).map((prompt) => (
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
      </div>
    </section>
  )
}
