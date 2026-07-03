/**
 * Supabase Storage bucket ids + path builders.
 *
 * IMPORTANT: object paths below do NOT repeat the bucket name — the bucket
 * is already a separate argument to every storage.js call (`.from(bucket)`).
 * "avatars/{userId}/avatar.png" in product docs means bucket `avatars`,
 * object path `{userId}/avatar.png`. See docs/storage.md.
 */

export const STORAGE_BUCKETS = {
  avatars: "avatars",
  journalImages: "journal-images",
  chartScreenshots: "chart-screenshots",
  lessonAssets: "lesson-assets",
  libraryAssets: "library-assets",
  communityImages: "community-images",
} as const

export type StorageBucket =
  (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS]

/** Strip path separators and anything that isn't safe in a storage key. */
export function sanitizeFilename(filename: string): string {
  const base = filename.trim().split(/[/\\]/).pop() || "file"
  return base.replace(/[^a-zA-Z0-9._-]/g, "-")
}

/** Bucket: avatars. RLS: owner upload/update/delete, public read. */
export function getAvatarPath(userId: string): string {
  return `${userId}/avatar.png`
}

/** Bucket: journal-images. RLS: private, owner-only. */
export function getJournalImagePath(
  userId: string,
  entryId: string,
  filename: string
): string {
  return `${userId}/${entryId}/${sanitizeFilename(filename)}`
}

/** Bucket: chart-screenshots. RLS: private, owner-only. */
export function getChartScreenshotPath(
  userId: string,
  sessionId: string,
  filename: string
): string {
  return `${userId}/${sessionId}/${sanitizeFilename(filename)}`
}

/** Bucket: lesson-assets. RLS: public read, service-role write only. */
export function getLessonAssetPath(lessonId: string, filename: string): string {
  return `${lessonId}/${sanitizeFilename(filename)}`
}

/** Bucket: library-assets. RLS: public read, service-role write only. */
export function getLibraryAssetPath(bookSlug: string, filename: string): string {
  return `${bookSlug}/${sanitizeFilename(filename)}`
}

/** Bucket: community-images. RLS: public read, owner upload only (no edit/delete). */
export function getCommunityImagePath(
  userId: string,
  postId: string,
  filename: string
): string {
  return `${userId}/${postId}/${sanitizeFilename(filename)}`
}
