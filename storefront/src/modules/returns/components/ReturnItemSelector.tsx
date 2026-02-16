"use client"

import * as React from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import { ItemWithDeliveryStatus } from "@lib/util/returns"
import { NumberField } from "@/components/NumberField"
import { ReturnReasonSelect } from "./ReturnReasonSelect"

export type ReturnItemSelection = {
  id: string
  quantity: number
  return_reason_id?: string
  note?: string
}

type ReturnItemSelectorProps = {
  items: ItemWithDeliveryStatus[]
  returnReasons: HttpTypes.StoreReturnReason[]
  onItemSelectionChange: (item: ReturnItemSelection) => void
  selectedItems: ReturnItemSelection[]
  currencyCode: string
}

const ReturnItemSelector: React.FC<ReturnItemSelectorProps> = ({
  items,
  returnReasons,
  onItemSelectionChange,
  selectedItems,
  currencyCode,
}) => {
  const handleQuantityChange = ({
    item_id,
    quantity,
    selected_item,
  }: {
    item_id: string
    quantity: number
    selected_item?: ReturnItemSelection
  }) => {
    const item = items.find((i) => i.id === item_id)
    if (!item || !item.isReturnable) return

    const maxQuantity = item.returnableQuantity
    const newQuantity = Math.max(0, Math.min(quantity, maxQuantity))

    onItemSelectionChange({
      id: item_id,
      quantity: newQuantity,
      return_reason_id: selected_item?.return_reason_id || "",
      note: selected_item?.note || "",
    })
  }

  const handleReturnReasonChange = ({
    item_id,
    return_reason_id,
    selected_item,
  }: {
    item_id: string
    return_reason_id: string
    selected_item?: ReturnItemSelection
  }) => {
    onItemSelectionChange({
      id: item_id,
      quantity: selected_item?.quantity || 0,
      return_reason_id,
      note: selected_item?.note || "",
    })
  }

  const handleNoteChange = ({
    item_id,
    note,
    selected_item,
  }: {
    item_id: string
    note: string
    selected_item?: ReturnItemSelection
  }) => {
    onItemSelectionChange({
      id: item_id,
      quantity: selected_item?.quantity || 0,
      return_reason_id: selected_item?.return_reason_id || "",
      note,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        const selectedItem = selectedItems.find((si) => si.id === item.id)
        const isSelected = selectedItem && selectedItem.quantity > 0

        return (
          <div
            key={item.id}
            className={`flex flex-col gap-4 p-4 border rounded-xs transition-colors ${
              !item.isReturnable
                ? "border-grayscale-200 bg-grayscale-50 opacity-60"
                : isSelected
                  ? "border-black"
                  : "border-grayscale-200"
            }`}
          >
            <div className="flex gap-4">
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

              <div className="flex-1 flex flex-col gap-2">
                <div>
                  <p className="font-medium">{item.product_title}</p>
                  {item.variant?.options?.map((option) => (
                    <p key={option.id} className="text-xs text-grayscale-500">
                      <span>{option.option?.title}: </span>
                      {option.value}
                    </p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 items-center justify-between mt-auto">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-grayscale-500">
                      Original quantity: {item.quantity}
                    </p>
                    {item.detail?.return_requested_quantity > 0 && (
                      <p className="text-xs text-grayscale-500">
                        Return requested:{" "}
                        {item.detail.return_requested_quantity}
                      </p>
                    )}
                    {item.detail?.return_received_quantity > 0 && (
                      <p className="text-xs text-grayscale-500">
                        Already returned: {item.detail.return_received_quantity}
                      </p>
                    )}
                    {!item.isReturnable && (
                      <p className="text-xs text-red-600">
                        {item.returnableQuantity === 0
                          ? "No returnable quantity"
                          : "Not eligible for return"}
                      </p>
                    )}
                  </div>
                  <p className="font-medium">
                    {convertToLocale({
                      currency_code: currencyCode,
                      amount: item.unit_price,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {item.isReturnable && (
              <div className="flex flex-col gap-4 pt-4 border-t border-grayscale-200">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <label className="text-grayscale-600">
                    Quantity to return:
                  </label>
                  <NumberField
                    size="sm"
                    value={selectedItem?.quantity || 0}
                    onChange={(quantity) =>
                      handleQuantityChange({
                        item_id: item.id,
                        quantity,
                        selected_item: selectedItem,
                      })
                    }
                    minValue={0}
                    maxValue={item.returnableQuantity}
                    className="w-28"
                  />
                </div>

                {isSelected && (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-grayscale-600">
                        Reason for return:{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <ReturnReasonSelect
                        value={selectedItem?.return_reason_id}
                        onChange={(return_reason_id) =>
                          handleReturnReasonChange({
                            item_id: item.id,
                            return_reason_id,
                            selected_item: selectedItem,
                          })
                        }
                        returnReasons={returnReasons}
                        placeholder="Select a reason"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-grayscale-600">
                        Additional notes (optional):
                      </label>
                      <textarea
                        value={selectedItem?.note || ""}
                        onChange={(e) =>
                          handleNoteChange({
                            item_id: item.id,
                            note: e.target.value,
                            selected_item: selectedItem,
                          })
                        }
                        className="w-full h-20 p-3 border border-grayscale-200 rounded-xs focus:border-grayscale-500 focus:outline-none resize-none"
                        placeholder="Provide any additional details about this return..."
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-grayscale-100">
                      <span className="text-grayscale-600">Refund amount:</span>
                      <span className="font-medium">
                        {convertToLocale({
                          currency_code: currencyCode,
                          amount:
                            item.unit_price * (selectedItem?.quantity || 0),
                        })}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ReturnItemSelector
