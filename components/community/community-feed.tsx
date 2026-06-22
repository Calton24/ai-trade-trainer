"use client"

import { useState } from "react"
import { HeartIcon, MessageCircleIcon, UsersIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CommunityPost } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CommunityFeedProps {
  posts: CommunityPost[]
}

const typeLabels: Record<CommunityPost["type"], string> = {
  drill_share: "Drill Share",
  mistake_discussion: "Discussion",
  challenge: "Challenge",
  general: "General",
}

export function CommunityFeed({ posts }: CommunityFeedProps) {
  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/50 p-5"
        >
          <div className="flex items-start gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/10 text-xs text-primary">
                {post.avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{post.author}</span>
                <Badge variant="secondary" className="text-xs">
                  {typeLabels[post.type]}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {post.content}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 pl-12 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <HeartIcon />
              {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircleIcon />
              Reply
            </span>
            <span>
              {new Date(post.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

interface WaitlistFormProps {
  className?: string
}

export function WaitlistForm({ className }: WaitlistFormProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Wire to Supabase community_waitlist table when auth is configured
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div
        className={cn(
          "rounded-xl border border-primary/20 bg-primary/5 p-6 text-center",
          className
        )}
      >
        <p className="font-medium text-primary">You&apos;re on the list!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;ll notify you when the Beginner Trading Circle launches on
          Discord.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border/60 bg-card/50 p-6 sm:flex-row",
        className
      )}
    >
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1"
      />
      <Button type="submit">Join Discord Waitlist</Button>
    </form>
  )
}

interface WeeklyChallengeCardProps {
  title: string
  description: string
  participants: number
}

export function WeeklyChallengeCard({
  title,
  description,
  participants,
}: WeeklyChallengeCardProps) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
      <div className="flex items-center gap-2 text-primary">
        <UsersIcon />
        <h3 className="font-medium">Weekly Challenge</h3>
      </div>
      <p className="mt-2 font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        {participants} learners participating · Preview only
      </p>
    </div>
  )
}
