/** Supabase OAuth provider keys (Microsoft uses Azure in Supabase). */
export const authProviders = ["google", "azure", "apple", "github"] as const

export type OAuthProviderId = (typeof authProviders)[number]

export interface OAuthProviderConfig {
  id: OAuthProviderId
  /** UI label */
  label: string
  /** Short label for account settings */
  shortLabel: string
}

export const OAUTH_PROVIDER_CONFIG: Record<OAuthProviderId, OAuthProviderConfig> =
  {
    google: { id: "google", label: "Continue with Google", shortLabel: "Google" },
    azure: {
      id: "azure",
      label: "Continue with Microsoft",
      shortLabel: "Microsoft",
    },
    apple: { id: "apple", label: "Continue with Apple", shortLabel: "Apple" },
    github: { id: "github", label: "Continue with GitHub", shortLabel: "GitHub" },
  }

export const OAUTH_PROVIDERS_LIST = authProviders.map(
  (id) => OAUTH_PROVIDER_CONFIG[id]
)

/** Map Supabase identity provider string to our config key. */
export function normalizeProviderKey(
  provider: string
): OAuthProviderId | "email" | null {
  if (provider === "email") return "email"
  if (provider === "azure" || provider === "microsoft") return "azure"
  if (authProviders.includes(provider as OAuthProviderId)) {
    return provider as OAuthProviderId
  }
  return null
}
