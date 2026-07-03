"use client"

import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  MAX_AVATAR_SIZE_BYTES,
  deleteUserFile,
  uploadAvatar,
} from "@/lib/storage/upload-service"
import { STORAGE_BUCKETS, getAvatarPath } from "@/lib/storage/paths"
import { cn } from "@/lib/utils"

interface AvatarUploadProps {
  userId: string
  avatarUrl: string | null
  onChange: (url: string | null) => void
}

type UploadStatus = "idle" | "uploading" | "success" | "error"

export function AvatarUpload({ userId, avatarUrl, onChange }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [message, setMessage] = useState<string | null>(null)

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    setStatus("uploading")
    setMessage(null)

    const result = await uploadAvatar(file)
    if (result.error || !result.url) {
      setStatus("error")
      setMessage(result.error ?? "Upload failed.")
      return
    }

    onChange(result.url)
    setStatus("success")
    setMessage("Avatar uploaded. Click Save profile to confirm.")
  }

  async function handleRemove() {
    setStatus("uploading")
    setMessage(null)
    const { error } = await deleteUserFile(
      STORAGE_BUCKETS.avatars,
      getAvatarPath(userId)
    )
    if (error) {
      setStatus("error")
      setMessage(error)
      return
    }
    onChange(null)
    setStatus("success")
    setMessage("Avatar removed. Click Save profile to confirm.")
  }

  return (
    <div className="space-y-2">
      <Label>Avatar</Label>
      <div className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-muted/40">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="size-full object-cover"
            />
          ) : (
            <span className="text-xs text-muted-foreground">No image</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={status === "uploading"}
              onClick={() => inputRef.current?.click()}
            >
              {status === "uploading" ? "Uploading..." : "Upload image"}
            </Button>
            {avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={status === "uploading"}
                onClick={() => void handleRemove()}
              >
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, WEBP or GIF. Max{" "}
            {Math.round(MAX_AVATAR_SIZE_BYTES / 1024 / 1024)}MB.
          </p>
          {message && (
            <p
              className={cn(
                "text-xs",
                status === "error" ? "text-destructive" : "text-primary"
              )}
            >
              {message}
            </p>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleFileSelected(e)}
      />
    </div>
  )
}
