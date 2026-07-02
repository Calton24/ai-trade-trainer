import { buildConcept, type ConceptInput } from "@/content/book-lab/concept-builder"
import type { BookLabConcept } from "@/lib/book-lab/types"

export const TRADING_IN_THE_ZONE_BOOK_ID = "trading-in-the-zone"

/**
 * Builds a Trading in the Zone concept with `tz-` id prefix so concept ids
 * never collide with the day-trading book (`bl-` prefix). Chart auto-mapping is
 * disabled because this is a pure trading-psychology book.
 */
export function buildZoneConcept(input: ConceptInput): BookLabConcept {
  return buildConcept(input, {
    idPrefix: "tz",
    bookId: TRADING_IN_THE_ZONE_BOOK_ID,
    disableChartDefaults: true,
  })
}
