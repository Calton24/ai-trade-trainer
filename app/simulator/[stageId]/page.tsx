import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SimulatorStageWorkspace } from "@/components/simulator/simulator-stage-workspace"
import { SIMULATOR_STAGES } from "@/content/simulator/stages"
import type { SimulatorStageId } from "@/lib/simulator/types"

export function generateStaticParams() {
  return SIMULATOR_STAGES.map((s) => ({ stageId: s.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stageId: string }>
}): Promise<Metadata> {
  const { stageId } = await params
  const stage = SIMULATOR_STAGES.find((s) => s.id === stageId)
  return {
    title: stage ? `${stage.title} — Simulator` : "Simulator",
  }
}

export default async function SimulatorStagePage({
  params,
}: {
  params: Promise<{ stageId: string }>
}) {
  const { stageId } = await params
  const valid = SIMULATOR_STAGES.some((s) => s.id === stageId)
  if (!valid) notFound()

  return <SimulatorStageWorkspace stageId={stageId as SimulatorStageId} />
}
