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

export type ReturnShippingMethod =
  | "prepaid_label"
  | "courier_pickup"
  | "drop_off"

type ReturnShippingOptionsProps = {
  value: ReturnShippingMethod
  onChange: (value: ReturnShippingMethod) => void
  className?: string
}

export const ReturnShippingOptions: React.FC<ReturnShippingOptionsProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <UiRadioGroup
      value={value}
      onChange={(newValue) => onChange(newValue as ReturnShippingMethod)}
      className={twMerge("flex flex-col gap-3", className)}
    >
      <UiRadio value="prepaid_label" variant="outline">
        <UiRadioBox />
        <div className="flex-1 flex items-center gap-3">
          <Icon name="receipt" className="w-5 h-5 text-grayscale-500" />
          <div className="flex flex-col">
            <UiRadioLabel className="font-medium">
              Prepaid return label
            </UiRadioLabel>
            <span className="text-xs text-grayscale-500">
              Print the label and drop off at any carrier location
            </span>
          </div>
        </div>
        <span className="text-sm font-medium text-green-700">Free</span>
      </UiRadio>

      <UiRadio value="courier_pickup" variant="outline">
        <UiRadioBox />
        <div className="flex-1 flex items-center gap-3">
          <Icon name="truck" className="w-5 h-5 text-grayscale-500" />
          <div className="flex flex-col">
            <UiRadioLabel className="font-medium">Courier pickup</UiRadioLabel>
            <span className="text-xs text-grayscale-500">
              Schedule a pickup at your address
            </span>
          </div>
        </div>
        <span className="text-sm font-medium text-green-700">Free</span>
      </UiRadio>

      <UiRadio value="drop_off" variant="outline">
        <UiRadioBox />
        <div className="flex-1 flex items-center gap-3">
          <Icon name="map-pin" className="w-5 h-5 text-grayscale-500" />
          <div className="flex flex-col">
            <UiRadioLabel className="font-medium">
              Drop-off location
            </UiRadioLabel>
            <span className="text-xs text-grayscale-500">
              Find the nearest drop-off point
            </span>
          </div>
        </div>
        <span className="text-sm font-medium text-green-700">Free</span>
      </UiRadio>
    </UiRadioGroup>
  )
}
