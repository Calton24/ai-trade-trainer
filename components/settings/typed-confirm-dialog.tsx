"use client"

import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function TypedConfirmDialog({
  trigger,
  title,
  description,
  confirmWord,
  confirmLabel,
  destructive,
  onConfirm,
}: {
  trigger: React.ReactNode
  title: string
  description: string
  confirmWord: string
  confirmLabel: string
  destructive?: boolean
  onConfirm: () => void | Promise<void>
}) {
  const [value, setValue] = useState("")
  const [busy, setBusy] = useState(false)
  const valid = value.trim().toUpperCase() === confirmWord.toUpperCase()

  return (
    <AlertDialog>
      <AlertDialogTrigger render={trigger as React.ReactElement} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="confirm-word">
            Type <span className="font-mono font-semibold">{confirmWord}</span> to
            confirm
          </Label>
          <Input
            id="confirm-word"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setValue("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!valid || busy}
            className={destructive ? "bg-destructive hover:bg-destructive/90" : undefined}
            onClick={async () => {
              setBusy(true)
              await onConfirm()
              setValue("")
              setBusy(false)
            }}
          >
            {busy ? "Working..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function SectionResetDialog({
  label,
  description,
  onConfirm,
}: {
  label: string
  description: string
  onConfirm: () => void | Promise<void>
}) {
  return (
    <TypedConfirmDialog
      title={`Reset ${label}?`}
      description={description}
      confirmWord="RESET"
      confirmLabel="Reset section"
      destructive
      onConfirm={onConfirm}
      trigger={<Button size="sm" variant="outline">Reset</Button>}
    />
  )
}
