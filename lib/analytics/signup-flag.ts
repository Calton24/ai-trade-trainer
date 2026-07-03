/**
 * Shared sessionStorage key used to detect a just-completed signup once the
 * user lands on `/onboarding` — needed because the Supabase signup server
 * action redirects server-side, so there's no client-side "success" state
 * to react to directly. See components/auth/sign-up-form.tsx and
 * components/onboarding/onboarding-wizard.tsx.
 */
export const SIGNUP_PENDING_STORAGE_KEY = "tta_signup_pending"
