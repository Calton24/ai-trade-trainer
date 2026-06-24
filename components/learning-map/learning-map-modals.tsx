"use client"

import Link from "next/link"
import { ArrowRightIcon, LockIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { LockInfo } from "@/lib/learning-map/types"

interface LockedContentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  lockInfo: LockInfo
}

export function LockedContentModal({
  open,
  onOpenChange,
  title,
  lockInfo,
}: LockedContentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LockIcon className="size-4 text-muted-foreground" />
            This is locked for now
          </DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{title}</span> unlocks
            after you build the right foundation — not to punish you, but to keep
            learning structured.
          </DialogDescription>
          <div className="space-y-3 text-left text-sm text-muted-foreground">
            {lockInfo.reason && <p>{lockInfo.reason}</p>}
            {lockInfo.missingPrerequisites.length > 0 && (
              <div>
                <p className="mb-2 font-medium text-foreground">
                  Prerequisites missing:
                </p>
                <ul className="space-y-1">
                  {lockInfo.missingPrerequisites.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={p.href}
                        className="text-primary hover:underline"
                        onClick={() => onOpenChange(false)}
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {lockInfo.ctaHref && (
            <Button render={<Link href={lockInfo.ctaHref} />}>
              Go to prerequisite
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          )}
          {lockInfo.previewHref && lockInfo.accessLevel === "preview" && (
            <Button
              variant="outline"
              render={<Link href={lockInfo.previewHref} />}
            >
              Preview concept
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface FoundationCompleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unlocks: readonly string[]
}

export function FoundationCompleteModal({
  open,
  onOpenChange,
  unlocks,
}: FoundationCompleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SparklesIcon className="size-5 text-primary" />
            Beginner Foundation Complete
          </DialogTitle>
          <DialogDescription>
            You&apos;ve covered the core concepts every trader needs first.
            Intermediate practice zones are now unlocked.
          </DialogDescription>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {unlocks.map((item) => (
              <li key={item} className="flex items-center gap-2 text-foreground">
                <span className="text-primary">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </DialogHeader>
        <DialogFooter>
          <Button render={<Link href="/learning-map" />}>
            View Learning Map
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
