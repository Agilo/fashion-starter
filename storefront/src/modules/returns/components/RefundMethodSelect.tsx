"use client"

import * as React from "react"
import { twMerge } from "tailwind-merge"
import {
  UiRadioGroup,
  UiRadio,
  UiRadioBox,
  UiRadioLabel,
} from "@/components/ui/Radio"
import { Icon } from "@/components/Icon"

export type RefundMethod = "original_payment" | "store_credit"

type RefundMethodSelectProps = {
  value: RefundMethod
  onChange: (value: RefundMethod) => void
  storeCreditBonus?: number
  className?: string
}

export const RefundMethodSelect: React.FC<RefundMethodSelectProps> = ({
  value,
  onChange,
  storeCreditBonus = 10,
  className,
}) => {
  return (
    <UiRadioGroup
      value={value}
      onChange={(newValue) => onChange(newValue as RefundMethod)}
      className={twMerge("flex flex-col gap-3", className)}
    >
      <UiRadio value="original_payment" variant="outline">
        <UiRadioBox />
        <div className="flex-1 flex items-center gap-3">
          <Icon name="credit-card" className="w-5 h-5 text-grayscale-500" />
          <div className="flex flex-col">
            <UiRadioLabel className="font-medium">
              Original payment method
            </UiRadioLabel>
            <span className="text-xs text-grayscale-500">
              Refund to the card/account used for purchase
            </span>
          </div>
        </div>
      </UiRadio>

      <UiRadio value="store_credit" variant="outline">
        <UiRadioBox />
        <div className="flex-1 flex items-center gap-3">
          <Icon name="receipt" className="w-5 h-5 text-grayscale-500" />
          <div className="flex flex-col">
            <UiRadioLabel className="font-medium">
              Store credit
              {storeCreditBonus > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                  +{storeCreditBonus}% bonus
                </span>
              )}
            </UiRadioLabel>
            <span className="text-xs text-grayscale-500">
              Get credit for future purchases
            </span>
          </div>
        </div>
      </UiRadio>
    </UiRadioGroup>
  )
}
