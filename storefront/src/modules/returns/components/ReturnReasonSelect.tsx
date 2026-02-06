"use client"

import * as React from "react"
import * as ReactAria from "react-aria-components"
import { twMerge } from "tailwind-merge"
import {
  UiSelectButton,
  UiSelectIcon,
  UiSelectListBox,
  UiSelectListBoxItem,
  UiSelectValue,
} from "@/components/ui/Select"

export const RETURN_REASONS = [
  { id: "defective", label: "Defective or damaged product" },
  { id: "wrong_item", label: "Wrong item received" },
  { id: "not_as_described", label: "Item does not match description" },
  { id: "changed_mind", label: "Changed my mind / No longer needed" },
  { id: "better_price", label: "Better price found elsewhere" },
  { id: "size_issue", label: "Size/fit issue" },
  { id: "quality", label: "Quality not as expected" },
  { id: "late_arrival", label: "Arrived too late" },
  { id: "other", label: "Other" },
] as const

export type ReturnReasonId = (typeof RETURN_REASONS)[number]["id"]

type ReturnReasonSelectProps = {
  value?: ReturnReasonId
  onChange: (value: ReturnReasonId) => void
  className?: string
  placeholder?: string
}

export const ReturnReasonSelect: React.FC<ReturnReasonSelectProps> = ({
  value,
  onChange,
  className,
  placeholder = "Select a reason",
}) => {
  return (
    <ReactAria.Select
      selectedKey={value}
      onSelectionChange={(key) => onChange(key as ReturnReasonId)}
      className={twMerge("w-full", className)}
    >
      <UiSelectButton>
        <UiSelectValue className="text-left">
          {value
            ? RETURN_REASONS.find((r) => r.id === value)?.label
            : placeholder}
        </UiSelectValue>
        <UiSelectIcon />
      </UiSelectButton>
      <ReactAria.Popover className="w-[--trigger-width]">
        <UiSelectListBox>
          {RETURN_REASONS.map((reason) => (
            <UiSelectListBoxItem key={reason.id} id={reason.id}>
              {reason.label}
            </UiSelectListBoxItem>
          ))}
        </UiSelectListBox>
      </ReactAria.Popover>
    </ReactAria.Select>
  )
}
