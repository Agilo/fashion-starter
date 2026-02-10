"use client"

import * as React from "react"
import * as ReactAria from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { HttpTypes } from "@medusajs/types"
import {
  UiSelectButton,
  UiSelectIcon,
  UiSelectListBox,
  UiSelectListBoxItem,
  UiSelectValue,
} from "@/components/ui/Select"

export type ReturnReason = HttpTypes.StoreReturnReason

type ReturnReasonSelectProps = {
  value?: string
  onChange: (value: string) => void
  returnReasons: ReturnReason[]
  className?: string
  placeholder?: string
}

export const ReturnReasonSelect: React.FC<ReturnReasonSelectProps> = ({
  value,
  onChange,
  returnReasons,
  className,
  placeholder = "Select a reason",
}) => {
  return (
    <ReactAria.Select
      selectedKey={value}
      onSelectionChange={(key) => onChange(key as string)}
      className={twMerge("w-full", className)}
    >
      <UiSelectButton>
        <UiSelectValue className="text-left">
          {value
            ? returnReasons.find((r) => r.id === value)?.label
            : placeholder}
        </UiSelectValue>
        <UiSelectIcon />
      </UiSelectButton>
      <ReactAria.Popover className="w-[--trigger-width]">
        <UiSelectListBox>
          {returnReasons.length === 0 ? (
            <UiSelectListBoxItem
              key="no-reasons"
              id="no-reasons"
              textValue="No return reasons available"
              isDisabled
            >
              <span className="text-grayscale-500 text-sm">
                No return reasons available
              </span>
            </UiSelectListBoxItem>
          ) : (
            returnReasons.map((reason) => (
              <UiSelectListBoxItem key={reason.id} id={reason.id}>
                {reason.label}
              </UiSelectListBoxItem>
            ))
          )}
        </UiSelectListBox>
      </ReactAria.Popover>
    </ReactAria.Select>
  )
}
