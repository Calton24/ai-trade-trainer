"use client"

import Link from "next/link"
import {
  CheckCircle2Icon,
  ChevronRightIcon,
  LockIcon,
  MapIcon,
  PlayIcon,
  SparklesIcon,
} from "lucide-react"

import { useUserState } from "@/components/providers/user-state-provider"
import { AppShell } from "@/components/layout/app-shell"
import {
  FoundationCompleteModal,
  LockedContentModal,
} from "@/components/learning-map/learning-map-modals"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FEATURE_BY_ID } from "@/content/learning-map/unlock-rules"
import { FOUNDATION_UNLOCKS } from "@/content/learning-map/foundation"
import { LEARNING_STAGES } from "@/content/learning-map/stages"
import { getNodeById } from "@/content/learning-map/nodes"
import {
  getAllStageProgress,
  getCurrentStageId,
  getLockInfo,
  getStageProgress,
  isNodeComplete,
  isStageUnlocked,
} from "@/lib/learning-map/unlocks"
import type { LearningStage, StageProgress } from "@/lib/learning-map/types"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { shouldCelebrateFoundation } from "@/lib/user-state"

function StageNode({
  stage,
  progress,
  isCurrent,
  onLockedClick,
  state,
}: {
  stage: LearningStage
  progress: StageProgress
  isCurrent: boolean
  onLockedClick: () => void
  state: import("@/lib/user-state/types").UserState
}) {
  const locked = progress.status === "locked"
  const completed = progress.status === "completed"
  const nextIncomplete = stage.requiredNodeIds.find(
    (id) => !isNodeComplete(state, id)
  )
  const nextNode = nextIncomplete ? getNodeById(nextIncomplete) : null
  const ctaHref = completed
    ? stage.href
    : nextNode?.href ?? stage.href
  const ctaLabel = completed
    ? "Review"
    : progress.status === "in_progress"
      ? "Continue"
      : locked
        ? "Locked"
        : "Start Stage"

  const CardInner = (
    <div
      className={cn(
        "relative rounded-xl border p-5 transition-all",
        completed && "border-primary/40 bg-primary/5",
        isCurrent && !completed && "border-primary shadow-[0_0_24px_-4px] shadow-primary/25",
        locked && "border-border/40 bg-muted/20 opacity-80",
        !locked && !completed && !isCurrent && "border-border/60 bg-card/50 hover:border-primary/30"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
              completed && "border-primary bg-primary text-primary-foreground",
              isCurrent && !completed && "border-primary bg-primary/15 text-primary",
              locked && "border-muted-foreground/30 bg-muted text-muted-foreground"
            )}
          >
            {completed ? (
              <CheckCircle2Icon className="size-5" />
            ) : locked ? (
              <LockIcon className="size-4" />
            ) : (
              stage.order
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{stage.title}</h3>
              {isCurrent && !completed && (
                <Badge variant="outline" className="border-primary/50 text-primary">
                  You are here
                </Badge>
              )}
              {progress.accessLevel === "preview" && !completed && (
                <Badge variant="secondary">Preview available</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{stage.description}</p>
          </div>
        </div>
        <Badge variant="outline" className="shrink-0 capitalize">
          {stage.stageType}
        </Badge>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>
              {progress.completedCount}/{progress.totalRequired} required steps
            </span>
            <span>{progress.progressPercent}%</span>
          </div>
          <Progress value={progress.progressPercent} />
        </div>

        <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
          <div>
            <span className="font-medium text-foreground">Skills gained: </span>
            {stage.skillsGained.join(", ")}
          </div>
          <div>
            <span className="font-medium text-foreground">Est. time: </span>
            {stage.estimatedMinutes} min
          </div>
        </div>

        {stage.unlockFeatureIds.length > 0 && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              Complete this to unlock:{" "}
            </span>
            {stage.unlockFeatureIds
              .map((id) => FEATURE_BY_ID[id]?.title ?? id)
              .join(", ")}
          </p>
        )}

        {!locked ? (
          <Button
            size="sm"
            variant={completed ? "outline" : "default"}
            render={<Link href={ctaHref} />}
          >
            {completed ? (
              "Review Stage"
            ) : (
              <>
                <PlayIcon data-icon="inline-start" />
                {ctaLabel}
              </>
            )}
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={onLockedClick}>
            <LockIcon data-icon="inline-start" />
            Why locked?
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "size-3 rounded-full ring-4 ring-background",
            completed && "bg-primary",
            isCurrent && !completed && "bg-primary animate-pulse",
            locked && "bg-muted-foreground/40"
          )}
        />
        {stage.order < LEARNING_STAGES.length && (
          <div
            className={cn(
              "w-0.5 flex-1 min-h-8",
              completed ? "bg-primary/50" : "bg-border"
            )}
          />
        )}
      </div>
      <div className="flex-1 pb-8">{CardInner}</div>
    </div>
  )
}

export function LearningMapContent() {
  const { state, learningMapStats, celebrateFoundation } = useUserState()
  const stageProgress = getAllStageProgress(state)
  const currentStageId = getCurrentStageId(state)
  const [lockedStage, setLockedStage] = useState<LearningStage | null>(null)
  const [showFoundation, setShowFoundation] = useState(false)

  useEffect(() => {
    if (shouldCelebrateFoundation(state, state.learningMap)) {
      setShowFoundation(true)
      celebrateFoundation()
    }
  }, [state, celebrateFoundation])

  const explorationUnlocked = LEARNING_STAGES.filter(
    (s) => isStageUnlocked(state, s.id) && getStageProgress(state, s.id).status !== "completed"
  ).flatMap((s) =>
    s.unlockFeatureIds
      .map((id) => FEATURE_BY_ID[id])
      .filter(Boolean)
      .map((f) => ({ stage: s.title, feature: f! }))
  )

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <MapIcon className="size-5" />
            <span className="text-sm font-medium">Guided Learning Path</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Learning Map
          </h1>
          <p className="mt-2 text-muted-foreground">
            Stage {learningMapStats.currentStageOrder} of {learningMapStats.totalStages}
            {learningMapStats.currentStageTitle
              ? ` — ${learningMapStats.currentStageTitle}`
              : ""}
            . Follow the path like levels in a game — each stage unlocks the next.
          </p>
        </div>

        {!learningMapStats.foundationComplete && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center gap-2 font-medium">
              <SparklesIcon className="size-4 text-primary" />
              Beginner Foundation
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete core topics to unlock Trend Spotter challenges, Chart Lab exercises,
              and Strategy Wiki practice.
            </p>
            <div className="mt-3">
              <Progress value={learningMapStats.foundationProgressPercent} />
              <p className="mt-1 text-xs text-muted-foreground">
                {learningMapStats.foundationProgressPercent}% complete
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col">
          {LEARNING_STAGES.map((stage) => {
            const progress = stageProgress.find((p) => p.stageId === stage.id)!
            return (
              <StageNode
                key={stage.id}
                stage={stage}
                progress={progress}
                isCurrent={stage.id === currentStageId}
                onLockedClick={() => setLockedStage(stage)}
                state={state}
              />
            )
          })}
        </div>

        {explorationUnlocked.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <h2 className="font-semibold">Exploration unlocked</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              These areas are open for practice — master them over time at your own pace.
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {explorationUnlocked.slice(0, 6).map(({ stage, feature }) => (
                <li key={feature.id}>
                  <Link
                    href={feature.href}
                    className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-3 text-sm hover:border-primary/40 hover:bg-primary/5"
                  >
                    <span>
                      <span className="font-medium">{feature.title}</span>
                      <span className="text-muted-foreground"> — from {stage}</span>
                    </span>
                    <ChevronRightIcon className="size-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          TradeTrainer AI is an educational simulator. It does not provide financial advice,
          trading signals, live trade recommendations, or profit guarantees.
        </p>
      </div>

      {lockedStage && (
        <LockedContentModal
          open={Boolean(lockedStage)}
          onOpenChange={() => setLockedStage(null)}
          title={lockedStage.title}
          lockInfo={getLockInfo(
            state,
            lockedStage.requiredNodeIds[0] ?? lockedStage.id
          )}
        />
      )}

      <FoundationCompleteModal
        open={showFoundation}
        onOpenChange={setShowFoundation}
        unlocks={FOUNDATION_UNLOCKS}
      />
    </AppShell>
  )
}
