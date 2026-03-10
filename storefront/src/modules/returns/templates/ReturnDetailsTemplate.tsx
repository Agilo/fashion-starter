"use client"

import * as React from "react"
import { Icon } from "@/components/Icon"
import { convertToLocale } from "@lib/util/money"
import { OrderItem } from "@modules/order/components/item/OrderItem"
import { twJoin } from "tailwind-merge"
import { ReturnStatus } from "@modules/returns/components/ReturnStatus"
import {
  calcExpectedRefundAmount,
  calcReturnItemAmount,
  ReturnWithOrderItems,
} from "@lib/util/returns"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs"

type ReturnDetailsTemplateProps = {
  returns?: ReturnWithOrderItems[]
  returnEntity?: ReturnWithOrderItems
  isGuest?: boolean
}

export const ReturnDetailsTemplate: React.FC<ReturnDetailsTemplateProps> = ({
  returns,
  returnEntity: singleReturn,
  isGuest = false,
}) => {
  const allReturns = returns || (singleReturn ? [singleReturn] : [])
  const hasMultipleReturns = allReturns.length > 1

  const [selectedReturnId, setSelectedReturnId] = React.useState(
    allReturns[0]?.id || ""
  )

  const returnEntity =
    allReturns.find((r) => r.id === selectedReturnId) || allReturns[0]

  if (!returnEntity) {
    return null
  }

  const expectedRefundAmount = calcExpectedRefundAmount(returnEntity)

  return (
    <div
      className={twJoin(
        "max-w-4xl mx-auto",
        isGuest && "py-32 min-h-screen col-span-full"
      )}
    >
      <div className="mb-8 md:mb-13">
        {!hasMultipleReturns && (
          <h1 className="text-md md:text-lg mb-4">
            {`Return #${returnEntity.display_id}`}
          </h1>
        )}
        {hasMultipleReturns && (
          <Tabs
            defaultValue={allReturns[0]?.id || ""}
            value={selectedReturnId}
            onChange={setSelectedReturnId}
          >
            <TabsList>
              {allReturns.map((ret) => (
                <TabsTrigger key={ret.id} value={ret.id || ""}>
                  Return #{ret.display_id}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>
      <div className="flex flex-col gap-6">
        <div className="rounded-xs border border-grayscale-200 flex flex-wrap justify-between p-4">
          <div className="flex gap-4 items-center">
            <Icon name="calendar" />
            <p className="text-grayscale-500">Return date</p>
          </div>
          <div>
            <p>{new Date(returnEntity.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4">
          <ReturnStatus returnEntity={returnEntity} />
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4 flex flex-col gap-6">
          {returnEntity.items?.map((returnItem) => {
            const item = returnItem.item
            return (
              <OrderItem
                key={returnItem.id || ""}
                thumbnail={item?.thumbnail || ""}
                product_handle={item?.product_handle || ""}
                product_title={item?.product_title || ""}
                title={item?.title || ""}
                quantity={returnItem.quantity}
                variant={item?.variant || undefined}
                fulfilled_total={calcReturnItemAmount(returnItem)}
                unit_price={item?.unit_price || 0}
                currencyCode={returnEntity.currency_code}
                className="flex gap-x-4 sm:gap-x-8 gap-y-6 pb-6 border-b border-grayscale-100 last:border-0 last:pb-0"
              />
            )
          })}
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
              <p>Est. Refund</p>
              <p>
                {convertToLocale({
                  currency_code: returnEntity.currency_code,
                  amount: expectedRefundAmount,
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
