"use client"

import * as React from "react"
import { Icon } from "@/components/Icon"
import { convertToLocale } from "@lib/util/money"
import {
  ReturnStatusTracker,
  ReturnStatus,
} from "@modules/returns/components/ReturnStatusTracker"
import { OrderItem } from "@modules/order/components/item/OrderItem"
import { HttpTypes } from "@medusajs/types"
import { twJoin } from "tailwind-merge"

type ReturnDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
  isGuest?: boolean
}

export const ReturnDetailsTemplate: React.FC<ReturnDetailsTemplateProps> = ({
  order,
  isGuest = false,
}) => {
  const returnItems =
    order.items?.filter((item) => {
      const returnRequested = item.detail?.return_requested_quantity || 0
      const returnReceived = item.detail?.return_received_quantity || 0
      return returnRequested > 0 || returnReceived > 0
    }) || []

  const totalRefund = returnItems.reduce((sum, item) => {
    const quantity =
      item.detail?.return_requested_quantity ||
      item.detail?.return_received_quantity ||
      0
    return sum + item.unit_price * quantity
  }, 0)

  const hasRequestedReturns = returnItems.some(
    (item) => (item.detail?.return_requested_quantity || 0) > 0
  )
  const allReturnsReceived = returnItems.every((item) => {
    const requested = item.detail?.return_requested_quantity || 0
    const received = item.detail?.return_received_quantity || 0
    if (requested === 0) return true
    return received >= requested
  })

  const returnStatus: ReturnStatus = allReturnsReceived
    ? "received"
    : hasRequestedReturns
      ? "requested"
      : "approved"

  return (
    <div
      className={twJoin("max-w-4xl mx-auto", isGuest && "py-32 min-h-screen")}
    >
      <h1 className="text-md md:text-lg mb-8 md:mb-13">
        Return for Order: {order.display_id}
      </h1>
      <div className="flex flex-col gap-6">
        <div className="rounded-xs border border-grayscale-200 flex flex-wrap justify-between p-4">
          <div className="flex gap-4 items-center">
            <Icon name="calendar" />
            <p className="text-grayscale-500">Order date</p>
          </div>
          <div>
            <p>{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4">
          <ReturnStatusTracker status={returnStatus} />
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4 flex flex-col gap-6">
          {order.items?.map((item) => (
            <OrderItem
              key={item.id}
              id={item.id}
              thumbnail={item.thumbnail}
              product_handle={item.product_handle}
              product_title={item.product_title}
              title={item.title}
              quantity={item.quantity}
              currencyCode={order.currency_code}
              amount={item.total}
              variant={item.variant}
              className="flex gap-x-4 sm:gap-x-8 gap-y-6 pb-6 border-b border-grayscale-100 last:border-0 last:pb-0"
            />
          ))}
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4">
          <div className="flex gap-4 items-center mb-4">
            <Icon name="credit-card" className="w-4 h-4" />
            <p className="text-grayscale-500">Refund Details</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="text-grayscale-500">Refund method</p>
              <p>Original Payment Method</p>
            </div>
            <div className="flex justify-between items-center text-md pt-4 border-t border-grayscale-200 mt-2">
              <p>Total Refund</p>
              <p>
                {convertToLocale({
                  currency_code: order.currency_code,
                  amount: totalRefund,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xs bg-grayscale-50 p-4">
          <div className="flex gap-4 items-center mb-2">
            <Icon name="info" className="w-4 h-4" />
            <h3 className="font-semibold">Need Help?</h3>
          </div>
          <p className="text-sm text-grayscale-600">
            If you have any questions about your return, please contact our
            customer support team at{" "}
            <a
              href="mailto:support@example.com"
              className="underline font-medium"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
