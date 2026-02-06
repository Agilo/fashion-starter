"use client"

import * as React from "react"
import { Icon } from "@/components/Icon"
import { convertToLocale } from "@lib/util/money"
import {
  ReturnStatusTracker,
  ReturnStatus,
} from "@modules/returns/components/ReturnStatusTracker"
import { ReturnReasonId } from "@modules/returns/components/ReturnReasonSelect"
import { OrderItem } from "@modules/order/components/item/OrderItem"

type ReturnedItem = {
  id: string
  title: string
  productTitle: string
  product_title: string
  product_handle: string
  thumbnail: string | null
  quantity: number
  unitPrice: number
  reason: ReturnReasonId
  variant?: {
    options?: Array<{
      id: string
      option?: { title?: string }
      value: string
    }>
  }
}

type ReturnTrackingData = {
  id: string
  orderId: string
  orderDisplayId: number
  status: ReturnStatus
  createdAt: string
  items: ReturnedItem[]
  totalRefund: number
  currencyCode: string
  refundMethod: "original_payment" | "store_credit"
  shippingMethod: string
  trackingNumber?: string
  estimatedRefundDate?: string
}

type ReturnTrackingTemplateProps = {
  returnData: ReturnTrackingData
  isGuest?: boolean
}

export const ReturnTrackingTemplate: React.FC<ReturnTrackingTemplateProps> = ({
  returnData,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 md:mb-13">
        <h1 className="text-md md:text-lg">
          Return #{returnData.id.slice(-8).toUpperCase()}
        </h1>
        <p className="text-grayscale-500">Order #{returnData.orderDisplayId}</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-xs border border-grayscale-200 p-4">
          <ReturnStatusTracker status={returnData.status} />
          <div className="mt-4 flex flex-wrap gap-x-8 justify-between gap-y-2">
            <p>
              <span className="text-grayscale-500">Submitted:</span>{" "}
              {new Date(returnData.createdAt).toLocaleDateString()}
            </p>
            {returnData.estimatedRefundDate && (
              <p>
                <span className="text-grayscale-500">Estimated refund:</span>{" "}
                {new Date(returnData.estimatedRefundDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {returnData.trackingNumber && (
          <div className="rounded-xs border border-grayscale-200 p-4">
            <div className="flex gap-4 items-center mb-4">
              <Icon name="truck" className="w-4 h-4" />
              <h2 className="font-semibold">Shipping Information</h2>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <p>
                <span className="text-grayscale-500">Tracking number: </span>
                <span className="font-medium">{returnData.trackingNumber}</span>
              </p>
              <p>
                <span className="text-grayscale-500">Carrier: </span>
                <span className="font-medium">UPS</span>
              </p>
            </div>
          </div>
        )}

        <div className="rounded-xs border border-grayscale-200 p-4">
          <div className="flex flex-col gap-4">
            {returnData.items.map((item) => (
              <OrderItem
                key={item.id}
                id={item.id}
                thumbnail={item.thumbnail}
                product_handle={item.product_handle}
                product_title={item.product_title}
                title={item.title}
                quantity={item.quantity}
                currencyCode={returnData.currencyCode}
                amount={item.unitPrice * item.quantity}
                variant={item.variant}
                className="flex gap-x-4 sm:gap-x-8 gap-y-6 pb-6 border-b border-grayscale-100 last:border-0 last:pb-0"
              />
            ))}
          </div>
        </div>

        <div className="rounded-xs border border-grayscale-200 p-4">
          <div className="flex gap-4 items-center mb-4">
            <Icon name="credit-card" className="w-4 h-4" />
            <p className="text-grayscale-500">Refund Details</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="text-grayscale-500">Refund method</p>
              <p>
                {returnData.refundMethod === "store_credit"
                  ? "Store Credit"
                  : "Original Payment Method"}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-grayscale-500">Status</p>
              <p className="capitalize">{returnData.status}</p>
            </div>
            <div className="flex justify-between items-center text-md pt-4 border-t border-grayscale-200 mt-2">
              <p>Total Refund</p>
              <p>
                {convertToLocale({
                  currency_code: returnData.currencyCode,
                  amount: returnData.totalRefund,
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
