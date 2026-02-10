"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import { Icon } from "@/components/Icon"
import { Button } from "@/components/Button"
import { LocalizedLink } from "@/components/LocalizedLink"
import { convertToLocale } from "@lib/util/money"
import {
  UiCheckbox,
  UiCheckboxBox,
  UiCheckboxIcon,
} from "@/components/ui/Checkbox"
import { NumberField } from "@/components/NumberField"
import {
  ReturnReasonSelect,
  ReturnReason,
} from "@modules/returns/components/ReturnReasonSelect"
import {
  RefundMethodSelect,
  RefundMethod,
} from "@modules/returns/components/RefundMethodSelect"
import {
  ReturnShippingOptions,
  ReturnShippingMethod,
} from "@modules/returns/components/ReturnShippingOptions"
import { ReturnSummary } from "@modules/returns/components/ReturnSummary"
import { twJoin } from "tailwind-merge"

type ReturnItemState = {
  id: string
  isSelected: boolean
  returnQuantity: number
  maxQuantity: number
  reason?: string
  otherReasonText?: string
  unitPrice: number
}

type ReturnCreationTemplateProps = {
  order: HttpTypes.StoreOrder
  returnReasons: ReturnReason[]
  isGuest?: boolean
}

export const ReturnCreationTemplate: React.FC<ReturnCreationTemplateProps> = ({
  order,
  returnReasons,
  isGuest = false,
}) => {
  /* TODO: check this state */
  const [returnItems, setReturnItems] = React.useState<
    Record<string, ReturnItemState>
  >(() => {
    const initial: Record<string, ReturnItemState> = {}
    order.items?.forEach((item) => {
      initial[item.id] = {
        id: item.id,
        isSelected: false,
        returnQuantity: 1,
        maxQuantity: item.quantity,
        reason: undefined,
        otherReasonText: "",
        unitPrice: item.unit_price ?? 0,
      }
    })
    return initial
  })

  const [refundMethod, setRefundMethod] =
    React.useState<RefundMethod>("original_payment")
  const [shippingMethod, setShippingMethod] =
    React.useState<ReturnShippingMethod>("prepaid_label")
  const [termsAccepted, setTermsAccepted] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  // Calculate selected items and totals
  const selectedItems = Object.values(returnItems).filter(
    (item) => item.isSelected
  )
  const totalReturnValue = selectedItems.reduce(
    (sum, item) => sum + item.unitPrice * item.returnQuantity,
    0
  )

  const updateItem = (itemId: string, updates: Partial<ReturnItemState>) => {
    setReturnItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], ...updates },
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const isFormValid =
    selectedItems.length > 0 &&
    selectedItems.every((item) => item.reason) &&
    termsAccepted

  if (isSubmitted) {
    return (
      <div
        className={twJoin(
          "max-w-xl mx-auto text-center py-16",
          isGuest &&
            "min-h-screen flex flex-col justify-center items-center col-span-full"
        )}
      >
        <h1 className="text-lg font-semibold mb-4">Return Request Submitted</h1>
        <p className="text-grayscale-500 mb-8">
          Your return request for order #{order.display_id} has been submitted
          successfully. You will receive an email with further instructions
          shortly.
        </p>
        {!isGuest ? (
          <LocalizedLink
            href="/account/my-orders"
            className="inline-flex items-center gap-2 text-sm font-medium border-b border-current"
          >
            <Icon name="arrow-left" className="w-4 h-4" />
            Back to My Orders
          </LocalizedLink>
        ) : (
          <LocalizedLink
            href="/returns/track"
            className="inline-flex items-center gap-2 text-sm font-medium border-b border-current"
          >
            Track Your Return
            <Icon name="arrow-right" className="w-4 h-4" />
          </LocalizedLink>
        )}
      </div>
    )
  }

  return (
    <div
      className={twJoin(
        "max-w-3xl mx-auto",
        isGuest && "w-full col-span-full min-h-screen flex flex-col py-32"
      )}
    >
      <h1 className="text-md md:text-lg mb-8 md:mb-13">Return items</h1>

      <div className="flex flex-col gap-6 mb-13">
        <div className="rounded-xs border border-grayscale-200 p-4">
          <div className="flex gap-4 items-center mb-4">
            <Icon name="receipt" className="w-4 h-4" />
            <p className="font-medium">Order #{order.display_id}</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-grayscale-500">
            <p>Order date: {new Date(order.created_at).toLocaleDateString()}</p>
            {typeof order.metadata?.delivered_at === "string" && (
              <p>
                Delivered:{" "}
                {new Date(order.metadata.delivered_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xs border border-grayscale-200 p-4">
          <h2 className="font-semibold mb-4">Select Items to Return</h2>
          <div className="flex flex-col gap-4">
            {order.items?.map((item) => {
              const itemState = returnItems[item.id]
              return (
                <div
                  key={item.id}
                  className={`flex flex-col gap-4 p-4 border rounded-xs transition-colors ${
                    itemState?.isSelected
                      ? "border-black"
                      : "border-grayscale-200"
                  }`}
                >
                  <div className="flex gap-4">
                    <UiCheckbox
                      isSelected={itemState?.isSelected ?? false}
                      onChange={(selected) =>
                        updateItem(item.id, { isSelected: selected })
                      }
                      className="self-start mt-1"
                    >
                      <UiCheckboxBox>
                        <UiCheckboxIcon />
                      </UiCheckboxBox>
                    </UiCheckbox>

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
                          <p
                            key={option.id}
                            className="text-xs text-grayscale-500"
                          >
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
                            currency_code: order.currency_code,
                            amount: item.unit_price ?? 0,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {itemState?.isSelected && (
                    <div className="ml-8 flex flex-col gap-4 pt-4 border-t border-grayscale-200">
                      <div className="flex flex-wrap gap-4 items-center justify-between">
                        <label className="text-sm text-grayscale-600">
                          Quantity to return:
                        </label>
                        <NumberField
                          size="sm"
                          value={itemState.returnQuantity}
                          onChange={(value) =>
                            updateItem(item.id, { returnQuantity: value })
                          }
                          minValue={1}
                          maxValue={item.quantity}
                          className="w-28"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm text-grayscale-600">
                          Reason for return:{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <ReturnReasonSelect
                          value={itemState.reason}
                          onChange={(reason) => updateItem(item.id, { reason })}
                          returnReasons={returnReasons}
                        />
                      </div>
                      {/* TODO: add TextArea component */}
                      {itemState.reason === "other" && (
                        <div className="flex flex-col gap-2">
                          <label className="text-sm text-grayscale-600">
                            Please explain:
                          </label>
                          <textarea
                            value={itemState.otherReasonText}
                            onChange={(e) =>
                              updateItem(item.id, {
                                otherReasonText: e.target.value,
                              })
                            }
                            className="w-full h-20 p-3 text-sm border border-grayscale-200 rounded-xs focus:border-grayscale-500 focus:outline-none resize-none"
                            placeholder="Please provide more details..."
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-grayscale-100">
                        <span className="text-sm text-grayscale-600">
                          Refund amount:
                        </span>
                        <span className="font-medium">
                          {convertToLocale({
                            currency_code: order.currency_code,
                            amount:
                              (item.unit_price ?? 0) * itemState.returnQuantity,
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4">
          <h2 className="font-semibold mb-4">Refund Method</h2>
          <RefundMethodSelect value={refundMethod} onChange={setRefundMethod} />
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4">
          <h2 className="font-semibold mb-4">Return Shipping</h2>
          <ReturnShippingOptions
            value={shippingMethod}
            onChange={setShippingMethod}
          />
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4">
          <UiCheckbox isSelected={termsAccepted} onChange={setTermsAccepted}>
            <UiCheckboxBox>
              <UiCheckboxIcon />
            </UiCheckboxBox>
            <span>
              I have read and agree to the{" "}
              <Link href="/return-policy" className="underline">
                Return Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms-of-use" className="underline">
                Terms and Conditions
              </Link>
            </span>
          </UiCheckbox>
        </div>
      </div>
      <div className="lg:sticky lg:top-32">
        <ReturnSummary
          itemsCount={selectedItems.length}
          totalReturnValue={totalReturnValue}
          currencyCode={order.currency_code}
          refundMethod={refundMethod}
          storeCreditBonus={10}
        />
        <Button
          isFullWidth
          className="mt-6"
          isVisuallyDisabled={!isFormValid}
          isLoading={isSubmitting}
          loadingText="Submitting..."
          onPress={handleSubmit}
        >
          Submit Return Request
        </Button>
        {selectedItems.length === 0 && (
          <p className="text-xs text-grayscale-500 text-center mt-3">
            Select at least one item to return
          </p>
        )}
      </div>
    </div>
  )
}
