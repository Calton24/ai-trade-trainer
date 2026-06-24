/** Re-exports prerequisite relationships derived from learning nodes. */
import { LEARNING_NODES } from "./nodes"

export const NODE_PREREQUISITES = Object.fromEntries(
  LEARNING_NODES.map((n) => [n.id, n.prerequisites])
) as Record<string, string[]>

export const NODE_UNLOCKS = Object.fromEntries(
  LEARNING_NODES.map((n) => [n.id, n.unlocks])
) as Record<string, string[]>
