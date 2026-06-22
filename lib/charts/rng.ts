/**
 * Deterministic seeded pseudo-random number generator.
 *
 * Charts must render identically every time a given lesson loads, so all
 * synthetic candle generation runs through a seeded RNG derived from a string.
 */

/** Hash a string into a 32-bit unsigned integer (xfnv1a). */
function hashSeed(seed: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  }
  return h >>> 0
}

/** mulberry32 — small, fast, deterministic PRNG. */
export function createRng(seed: string) {
  let a = hashSeed(seed)
  return function next(): number {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Rng = ReturnType<typeof createRng>

/** Random float in [min, max). */
export function randRange(rng: Rng, min: number, max: number): number {
  return min + rng() * (max - min)
}

/** Random signed jitter in [-amount, amount). */
export function jitter(rng: Rng, amount: number): number {
  return (rng() - 0.5) * 2 * amount
}
