"use client"

import * as React from "react"
import Image from "next/image"
import { twMerge } from "tailwind-merge"
import {
  UiCheckbox,
  UiCheckboxBox,
  UiCheckboxIcon,
} from "@/components/ui/Checkbox"
import { NumberField } from "@/components/NumberField"
import {
  ReturnReasonSelect,
  ReturnReasonId,
} from "@modules/returns/components/ReturnReasonSelect"
import { convertToLocale } from "@lib/util/money"

export type ReturnProductItemData = {
  id: string
  title: string
  productTitle: string
  thumbnail: string | null
  quantity: number
  unitPrice: number
  currencyCode: string
  variant?: {
    options?: Array<{
      id: string
      option?: { title?: string }
      value: string
    }>
  }
}

type ReturnProductItemProps = {
  item: ReturnProductItemData
  isSelected: boolean
  onSelectionChange: (selected: boolean) => void
  returnQuantity: number
  onQuantityChange: (quantity: number) => void
  returnReason?: ReturnReasonId
  onReasonChange: (reason: ReturnReasonId) => void
  otherReasonText?: string
  onOtherReasonTextChange?: (text: string) => void
  className?: string
}

export const ReturnProductItem: React.FC<ReturnProductItemProps> = ({
  item,
  isSelected,
  onSelectionChange,
  returnQuantity,
  onQuantityChange,
  returnReason,
  onReasonChange,
  otherReasonText,
  onOtherReasonTextChange,
  className,
}) => {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-4 p-4 border border-grayscale-200 rounded-xs transition-colors",
        isSelected && "border-black bg-grayscale-50",
        className
      )}
    >
      <div className="flex gap-4">
        {/* Checkbox */}
        <UiCheckbox
          isSelected={isSelected}
          onChange={onSelectionChange}
          className="self-start mt-1"
        >
          <UiCheckboxBox>
            <UiCheckboxIcon />
          </UiCheckboxBox>
        </UiCheckbox>

        {/* Product Image */}
        {item.thumbnail && (
          <div className="w-20 aspect-[3/4] relative overflow-hidden rounded-2xs shrink-0">
            <Image
              src={item.thumbnail}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-2">
          <div>
            <p className="font-medium">{item.productTitle}</p>
            {item.variant?.options?.map((option) => (
              <p key={option.id} className="text-xs text-grayscale-500">
                <span>{option.option?.title}: </span>
                {option.value}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-between mt-auto">
            <p className="text-xs text-grayscale-500">
              Original quantity: {item.quantity}
            </p>
            <p className="font-medium">
              {convertToLocale({
                currency_code: item.currencyCode,
                amount: item.unitPrice,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Return Options - Only shown when selected */}
      {isSelected && (
        <div className="ml-8 flex flex-col gap-4 pt-4 border-t border-grayscale-200">
          {/* Quantity Selector */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <label className="text-sm text-grayscale-600">
              Quantity to return:
            </label>
            <NumberField
              size="sm"
              value={returnQuantity}
              onChange={onQuantityChange}
              minValue={1}
              maxValue={item.quantity}
              className="w-28"
            />
          </div>

          {/* Reason Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-grayscale-600">
              Reason for return:
            </label>
            <ReturnReasonSelect
              value={returnReason}
              onChange={onReasonChange}
            />
          </div>

          {/* Other Reason Text */}
          {returnReason === "other" && onOtherReasonTextChange && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-grayscale-600">
                Please explain:
              </label>
              <textarea
                value={otherReasonText}
                onChange={(e) => onOtherReasonTextChange(e.target.value)}
                className="w-full h-20 p-3 text-sm border border-grayscale-200 rounded-xs focus:border-grayscale-500 focus:outline-none resize-none"
                placeholder="Please provide more details about your return..."
              />
            </div>
          )}

          {/* Line Item Refund Amount */}
          <div className="flex justify-between items-center pt-2 border-t border-grayscale-100">
            <span className="text-sm text-grayscale-600">Refund amount:</span>
            <span className="font-medium">
              {convertToLocale({
                currency_code: item.currencyCode,
                amount: item.unitPrice * returnQuantity,
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
