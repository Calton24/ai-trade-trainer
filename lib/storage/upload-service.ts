"use client"

import { getStorageClient, uploadFile, removeFile, getPublicUrl } from "@/lib/storage/client"
import {
  STORAGE_BUCKETS,
  getAvatarPath,
  getChartScreenshotPath,
  getJournalImagePath,
  sanitizeFilename,
  type StorageBucket,
} from "@/lib/storage/paths"

export const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024 // 2MB
export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024 // 5MB (journal/chart images)

export interface UploadResult {
  url?: string
  path?: string
  error?: string
}

function validateImageFile(
  file: File,
  maxSizeBytes: number
): { error?: string } {
  if (!file.type.startsWith("image/")) {
    return { error: "Only image files are allowed." }
  }
  if (file.size > maxSizeBytes) {
    return {
      error: `File is too large. Max size is ${Math.round(maxSizeBytes / 1024 / 1024)}MB.`,
    }
  }
  return {}
}

async function getCurrentUserId(): Promise<string | null> {
  const supabase = getStorageClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

/** Uploads to avatars/{userId}/avatar.png and returns the public URL. */
export async function uploadAvatar(file: File): Promise<UploadResult> {
  const validation = validateImageFile(file, MAX_AVATAR_SIZE_BYTES)
  if (validation.error) return { error: validation.error }

  const userId = await getCurrentUserId()
  if (!userId) return { error: "You must be signed in to upload an avatar." }

  const path = getAvatarPath(userId)
  const { error } = await uploadFile(STORAGE_BUCKETS.avatars, path, file, {
    upsert: true,
    contentType: file.type,
  })
  if (error) return { error }

  return { path, url: getPublicUrl(STORAGE_BUCKETS.avatars, path) }
}

/** Uploads to journal-images/{userId}/{entryId}/{filename}. Bucket is private — returns a path, not a public URL. */
export async function uploadJournalImage(
  entryId: string,
  file: File
): Promise<UploadResult> {
  const validation = validateImageFile(file, MAX_UPLOAD_SIZE_BYTES)
  if (validation.error) return { error: validation.error }

  const userId = await getCurrentUserId()
  if (!userId) return { error: "You must be signed in to upload an image." }

  const path = getJournalImagePath(userId, entryId, sanitizeFilename(file.name))
  const { error } = await uploadFile(STORAGE_BUCKETS.journalImages, path, file, {
    contentType: file.type,
  })
  if (error) return { error }
  return { path }
}

/** Uploads to chart-screenshots/{userId}/{sessionId}/{filename}. Bucket is private — returns a path, not a public URL. */
export async function uploadChartScreenshot(
  sessionId: string,
  file: File
): Promise<UploadResult> {
  const validation = validateImageFile(file, MAX_UPLOAD_SIZE_BYTES)
  if (validation.error) return { error: validation.error }

  const userId = await getCurrentUserId()
  if (!userId) return { error: "You must be signed in to upload a screenshot." }

  const path = getChartScreenshotPath(
    userId,
    sessionId,
    sanitizeFilename(file.name)
  )
  const { error } = await uploadFile(
    STORAGE_BUCKETS.chartScreenshots,
    path,
    file,
    { contentType: file.type }
  )
  if (error) return { error }
  return { path }
}

/** Public URL for a path in a public bucket (avatars, lesson-assets, library-assets, community-images). */
export function getPublicAssetUrl(bucket: StorageBucket, path: string): string {
  return getPublicUrl(bucket, path)
}

/** Deletes a file the current user owns (RLS enforces ownership server-side). */
export async function deleteUserFile(
  bucket: StorageBucket,
  path: string
): Promise<{ error?: string }> {
  return removeFile(bucket, path)
}
