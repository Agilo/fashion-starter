"use client"

import * as React from "react"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { HttpTypes } from "@medusajs/types"
import { Icon } from "@/components/Icon"
import { Button } from "@/components/Button"
import { LocalizedLink } from "@/components/LocalizedLink"
import {
  UiCheckbox,
  UiCheckboxBox,
  UiCheckboxIcon,
} from "@/components/ui/Checkbox"
import { ReturnReason } from "@modules/returns/components/ReturnReasonSelect"
import ReturnItemSelector, {
  ReturnItemSelection,
} from "@modules/returns/components/ReturnItemSelector"
import { enhanceItemsWithReturnStatus } from "@lib/util/returns"
import ReturnShippingSelector from "@modules/returns/components/ReturnShippingSelector"
import { ReturnSummary } from "@modules/returns/components/ReturnSummary"
import { twJoin } from "tailwind-merge"
import { createReturnRequest } from "@lib/data/returns"

function SubmitButton({
  isDisabled,
  selectedItemsCount,
}: {
  isDisabled: boolean
  selectedItemsCount: number
}) {
  const { pending } = useFormStatus()

  return (
    <>
      <Button
        isFullWidth
        className="mt-6"
        isDisabled={isDisabled || pending}
        isLoading={pending}
        loadingText="Submitting..."
        type="submit"
      >
        Submit Return Request
      </Button>
      {selectedItemsCount === 0 && (
        <p className="text-xs text-grayscale-500 text-center mt-3">
          Select at least one item to return
        </p>
      )}
    </>
  )
}

type ReturnCreationTemplateProps = {
  order: HttpTypes.StoreOrder
  returnReasons: ReturnReason[]
  shippingOptions: HttpTypes.StoreCartShippingOption[]
  cartId: string
  isGuest?: boolean
}

export const ReturnCreationTemplate: React.FC<ReturnCreationTemplateProps> = ({
  order,
  returnReasons,
  shippingOptions,
  cartId,
  isGuest = false,
}) => {
  const [selectedItems, setSelectedItems] = React.useState<
    ReturnItemSelection[]
  >([])
  const [selectedShippingOption, setSelectedShippingOption] = React.useState("")
  const [termsAccepted, setTermsAccepted] = React.useState(false)
  const [state, formAction] = React.useActionState(createReturnRequest, {
    success: false,
    error: null,
    return: null,
  })

  const itemsWithDeliveryStatus = enhanceItemsWithReturnStatus(
    order.items || []
  )

  const handleItemSelection = ({
    id,
    quantity,
    return_reason_id,
    note,
  }: ReturnItemSelection) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        if (quantity === 0) {
          return prev.filter((item) => item.id !== id)
        }
        return prev.map((item) => {
          return item.id === id
            ? { ...item, quantity, return_reason_id, note }
            : item
        })
      } else if (quantity > 0) {
        return [...prev, { id, quantity, return_reason_id, note }]
      }
      return prev
    })
  }

  const handleSubmit = (formData: FormData) => {
    formData.append("order_id", order.id)
    formData.append("items", JSON.stringify(selectedItems))
    formData.append("return_shipping_option_id", selectedShippingOption)
    const locationId = shippingOptions.find(
      (opt) => opt.id === selectedShippingOption
      //@ts-ignore
    )?.service_zone.fulfillment_set.location.id
    formData.append("location_id", locationId)
    formAction(formData)
  }

  if (state.success && state.return) {
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

      <form action={handleSubmit}>
        <div className="flex flex-col gap-6 mb-13">
          <div className="rounded-xs border border-grayscale-200 p-4">
            <div className="flex gap-4 items-center mb-4">
              <Icon name="receipt" className="w-4 h-4" />
              <p className="font-medium">Order #{order.display_id}</p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-grayscale-500">
              <p>
                Order date: {new Date(order.created_at).toLocaleDateString()}
              </p>
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
            <ReturnItemSelector
              items={itemsWithDeliveryStatus}
              returnReasons={returnReasons}
              onItemSelectionChange={handleItemSelection}
              selectedItems={selectedItems}
              currencyCode={order.currency_code}
            />
          </div>
          <div className="rounded-xs border border-grayscale-200 p-4">
            <h2 className="font-semibold mb-4">Return Shipping</h2>
            <ReturnShippingSelector
              shippingOptions={shippingOptions}
              selectedOption={selectedShippingOption}
              onOptionSelect={setSelectedShippingOption}
              cartId={cartId}
              currencyCode={order.currency_code}
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
            totalReturnValue={selectedItems.reduce((total, selected) => {
              const item = itemsWithDeliveryStatus.find(
                (itm) => itm.id === selected.id
              )
              if (!item) return total
              return total + item.unit_price * selected.quantity
            }, 0)}
            currencyCode={order.currency_code}
          />
          <SubmitButton
            isDisabled={
              selectedItems.length === 0 ||
              selectedShippingOption === "" ||
              !termsAccepted
            }
            selectedItemsCount={selectedItems.length}
          />
          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
              <p className="text-red-800 text-sm">{state.error}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
