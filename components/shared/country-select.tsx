"use client"

import {
  COUNTRIES,
  normalizeCountryName,
  OTHER_COUNTRIES,
  POPULAR_COUNTRIES,
} from "@/lib/countries"
import { cn } from "@/lib/utils"

const selectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"

const glassSelectClassName =
  "flex h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm shadow-sm backdrop-blur-sm outline-none transition-colors focus-visible:border-primary/40 focus-visible:ring-3 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"

interface CountrySelectProps {
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  className?: string
  placeholder?: string
  required?: boolean
  variant?: "default" | "glass"
}

function CountryOptions({ includeLegacy }: { includeLegacy?: string }) {
  const legacy =
    includeLegacy &&
    !COUNTRIES.some(
      (c) => c.name.toLowerCase() === includeLegacy.toLowerCase()
    )
      ? includeLegacy
      : null

  return (
    <>
      <optgroup label="Popular">
        {POPULAR_COUNTRIES.map((country) => (
          <option key={country.code} value={country.name}>
            {country.name}
          </option>
        ))}
      </optgroup>
      <optgroup label="All countries">
        {OTHER_COUNTRIES.map((country) => (
          <option key={country.code} value={country.name}>
            {country.name}
          </option>
        ))}
      </optgroup>
      {legacy && (
        <optgroup label="Saved value">
          <option value={legacy}>{legacy}</option>
        </optgroup>
      )}
    </>
  )
}

export function CountrySelect({
  id,
  name,
  value,
  defaultValue,
  onChange,
  className,
  placeholder = "Select country…",
  required,
  variant = "default",
}: CountrySelectProps) {
  const normalizedValue =
    value !== undefined ? normalizeCountryName(value) : undefined
  const normalizedDefault =
    defaultValue !== undefined ? normalizeCountryName(defaultValue) : undefined

  const isControlled = value !== undefined

  return (
    <select
      id={id}
      name={name}
      {...(isControlled
        ? { value: normalizedValue }
        : { defaultValue: normalizedDefault ?? "" })}
      required={required}
      onChange={
        onChange
          ? (event) => onChange(event.target.value)
          : undefined
      }
      className={cn(
        variant === "glass" ? glassSelectClassName : selectClassName,
        className
      )}
    >
      <option value="">{placeholder}</option>
      <CountryOptions includeLegacy={normalizedValue || normalizedDefault} />
    </select>
  )
}
