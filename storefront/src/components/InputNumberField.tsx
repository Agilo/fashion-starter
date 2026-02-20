"use client"

import * as React from "react"
import * as ReactAria from "react-aria-components"
import { twJoin, twMerge } from "tailwind-merge"
import { Icon } from "@/components/Icon"

type InputNumberFieldProps = Omit<
  ReactAria.InputProps,
  "type" | "size" | "value" | "defaultValue" | "onChange"
> & {
  size?: "sm" | "base"
  value?: number
  onChange?: (value: number) => void
  onCommit?: (value: number) => void
  minValue?: number
  maxValue?: number
  step?: number
  isDisabled?: boolean
}

const clampValue = (value: number, min?: number, max?: number) => {
  if (typeof min === "number" && value < min) return min
  if (typeof max === "number" && value > max) return max
  return value
}

const coerceInputValue = (value: string) => {
  if (value.trim() === "") return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export const InputNumberField: React.FC<InputNumberFieldProps> = ({
  size = "base",
  className,
  value,
  onChange,
  onCommit,
  minValue,
  maxValue,
  step = 1,
  isDisabled,
  onBlur,
  onFocus,
  ...rest
}) => {
  const resolvedValue = typeof value === "number" ? value : undefined
  const [inputValue, setInputValue] = React.useState(
    resolvedValue === undefined ? "" : `${resolvedValue}`
  )
  const isFocusedRef = React.useRef(false)

  React.useEffect(() => {
    if (!isFocusedRef.current) {
      setInputValue(resolvedValue === undefined ? "" : `${resolvedValue}`)
    }
  }, [resolvedValue])

  const getBaseValue = React.useCallback(() => {
    const parsed = coerceInputValue(inputValue)
    if (parsed !== null) return parsed
    if (typeof resolvedValue === "number") return resolvedValue
    if (typeof minValue === "number") return minValue
    return 0
  }, [inputValue, minValue, resolvedValue])

  const baseValue = getBaseValue()
  const canDecrement =
    typeof minValue === "number" ? baseValue > minValue : true
  const canIncrement =
    typeof maxValue === "number" ? baseValue < maxValue : true

  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value
      setInputValue(nextValue)

      if (!onChange) return
      const parsed = coerceInputValue(nextValue)
      if (parsed === null) return
      onChange(clampValue(parsed, minValue, maxValue))
    },
    [maxValue, minValue, onChange]
  )

  const normalizeOnBlur = React.useCallback(() => {
    if (!onChange) {
      setInputValue(resolvedValue === undefined ? "" : `${resolvedValue}`)
      return null
    }

    const parsed = coerceInputValue(inputValue)
    if (parsed === null) {
      const fallback = clampValue(baseValue, minValue, maxValue)
      onChange(fallback)
      setInputValue(`${fallback}`)
      return fallback
    }

    const clamped = clampValue(parsed, minValue, maxValue)
    if (clamped !== parsed) {
      onChange(clamped)
      setInputValue(`${clamped}`)
    }
    return clamped
  }, [baseValue, inputValue, maxValue, minValue, onChange, resolvedValue])

  const handleDecrement = React.useCallback(() => {
    if (!onChange || isDisabled || !canDecrement) return
    const nextValue = clampValue(baseValue - step, minValue, maxValue)
    onChange(nextValue)
    setInputValue(`${nextValue}`)
    onCommit?.(nextValue)
  }, [
    canDecrement,
    baseValue,
    isDisabled,
    maxValue,
    minValue,
    onChange,
    onCommit,
    step,
  ])

  const handleIncrement = React.useCallback(() => {
    if (!onChange || isDisabled || !canIncrement) return
    const nextValue = clampValue(baseValue + step, minValue, maxValue)
    onChange(nextValue)
    setInputValue(`${nextValue}`)
    onCommit?.(nextValue)
  }, [
    canIncrement,
    baseValue,
    isDisabled,
    maxValue,
    minValue,
    onChange,
    onCommit,
    step,
  ])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault()
        handleDecrement()
        return
      }
      if (event.key === "ArrowUp") {
        event.preventDefault()
        handleIncrement()
        return
      }
      if (event.key === "Enter") {
        event.preventDefault()
        const committedValue = normalizeOnBlur()
        if (committedValue !== null) {
          onCommit?.(committedValue)
        }
      }
    },
    [handleDecrement, handleIncrement, normalizeOnBlur, onCommit]
  )

  return (
    <div
      className={twMerge(
        "flex justify-between border border-grayscale-200 rounded-xs",
        size === "sm" ? "h-8 px-4" : "h-12 px-6",
        className as string
      )}
    >
      <ReactAria.Button
        onPress={handleDecrement}
        isDisabled={isDisabled || !canDecrement}
        className="disabled:text-grayscale-200 transition-colors shrink-0"
      >
        <Icon
          name="minus"
          className={twJoin(size === "sm" ? "w-4 h-4" : "w-6 h-6")}
        />
      </ReactAria.Button>
      <ReactAria.Input
        {...rest}
        type="number"
        value={inputValue}
        min={minValue}
        max={maxValue}
        step={step}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={(event) => {
          isFocusedRef.current = true
          onFocus?.(event)
        }}
        onBlur={(event) => {
          isFocusedRef.current = false
          const committedValue = normalizeOnBlur()
          if (committedValue !== null) {
            onCommit?.(committedValue)
          }
          onBlur?.(event)
        }}
        disabled={isDisabled}
        className={twJoin(
          "disabled:text-grayscale-200 disabled:bg-transparent text-center focus-within:outline-none w-7 leading-none appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          size === "sm" ? "text-xs" : "text-sm"
        )}
      />
      <ReactAria.Button
        onPress={handleIncrement}
        isDisabled={isDisabled || !canIncrement}
        className="disabled:text-grayscale-200 transition-colors shrink-0"
      >
        <Icon
          name="plus"
          className={twJoin(size === "sm" ? "w-4 h-4" : "w-6 h-6")}
        />
      </ReactAria.Button>
    </div>
  )
}
