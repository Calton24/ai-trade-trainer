/** ISO 3166-1 alpha-2 codes — UN members and common territories. */
const ISO_COUNTRY_CODES = [
  "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU",
  "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL",
  "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC",
  "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV",
  "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG",
  "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD",
  "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT",
  "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM",
  "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH",
  "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK",
  "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH",
  "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW",
  "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR",
  "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR",
  "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC",
  "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS",
  "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL",
  "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY",
  "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "YE", "YT", "ZA",
  "ZM", "ZW",
] as const

export type CountryCode = (typeof ISO_COUNTRY_CODES)[number]

export interface Country {
  code: CountryCode
  name: string
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" })

function buildCountry(code: CountryCode): Country | null {
  const name = regionNames.of(code)
  if (!name || name === code) return null
  return { code, name }
}

/** All countries sorted alphabetically by display name. */
export const COUNTRIES: Country[] = ISO_COUNTRY_CODES.map(buildCountry)
  .filter((c): c is Country => c !== null)
  .sort((a, b) => a.name.localeCompare(b.name, "en"))

/** Shown first in dropdowns for quicker selection. */
export const POPULAR_COUNTRY_CODES: CountryCode[] = [
  "GB",
  "US",
  "CA",
  "AU",
  "DE",
  "FR",
  "IN",
  "IE",
  "NL",
  "SG",
  "AE",
  "NG",
  "ZA",
  "BR",
  "ES",
  "IT",
  "JP",
  "KR",
  "MX",
  "NZ",
]

const popularSet = new Set<string>(POPULAR_COUNTRY_CODES)

export const POPULAR_COUNTRIES: Country[] = POPULAR_COUNTRY_CODES.map((code) =>
  COUNTRIES.find((c) => c.code === code)
).filter((c): c is Country => c !== undefined)

export const OTHER_COUNTRIES: Country[] = COUNTRIES.filter(
  (c) => !popularSet.has(c.code)
)

const names = new Set(COUNTRIES.map((c) => c.name))

/** Match a stored country string to a known option (case-insensitive). */
export function normalizeCountryName(value: string | null | undefined): string {
  if (!value?.trim()) return ""
  const trimmed = value.trim()
  if (names.has(trimmed)) return trimmed
  const match = COUNTRIES.find(
    (c) => c.name.toLowerCase() === trimmed.toLowerCase()
  )
  return match?.name ?? trimmed
}

export function isKnownCountry(value: string | null | undefined): boolean {
  if (!value?.trim()) return false
  return names.has(normalizeCountryName(value))
}
