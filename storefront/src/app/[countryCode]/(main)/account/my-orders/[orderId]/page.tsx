import * as React from "react"
import { Metadata } from "next"

import { retrieveOrder } from "@lib/data/orders"
import { OrderTotals } from "@modules/order/components/OrderTotals"
import { OrderItem } from "@modules/order/components/item/OrderItem"
import { Icon } from "@/components/Icon"
import { getCustomer } from "@lib/data/customer"
import { redirect } from "next/navigation"
import {
  calcExpectedRefundAmount,
  getOrderReturns,
  hasReturnableItems,
  type OrderWithReturns,
} from "@lib/util/returns"
import { convertToLocale } from "@lib/util/money"
import { OrderStatus } from "@modules/order/components/OrderStatus"
import { LocalizedButtonLink, LocalizedLink } from "@/components/LocalizedLink"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Account - Order Details",
  description: "Check your order history",
}

export default async function AccountOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const customer = await getCustomer().catch(() => null)

  if (!customer) {
    redirect(`/`)
  }

  const { orderId } = await params
  const order = (await retrieveOrder(orderId)) as OrderWithReturns

  const hasReturnableItemsInOrder = hasReturnableItems(order)
  const orderReturns = getOrderReturns(order)

  return (
    <>
      <h1 className="text-md md:text-lg mb-8 md:mb-13">
        Order #{order.display_id}
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
        <div className="rounded-xs border border-grayscale-200 p-4 flex flex-wrap gap-x-10 gap-y-8 justify-between items-end w-full">
          <OrderStatus order={order} />
        </div>
        <div className="flex max-sm:flex-col gap-x-4 gap-y-6 md:flex-col lg:flex-row">
          <div className="flex-1 overflow-hidden rounded-xs border border-grayscale-200 p-4">
            <div className="flex gap-4 items-center mb-8">
              <Icon name="map-pin" />
              <p className="text-grayscale-500">Delivery address</p>
            </div>
            <div>
              <p>
                {[
                  order.shipping_address?.first_name,
                  order.shipping_address?.last_name,
                ]
                  .filter(Boolean)
                  .join(" ")}
              </p>
              {Boolean(order.shipping_address?.company) && (
                <p>{order.shipping_address?.company}</p>
              )}
              <p>
                {[
                  order.shipping_address?.address_1,
                  order.shipping_address?.address_2,
                  [
                    order.shipping_address?.postal_code,
                    order.shipping_address?.city,
                  ]
                    .filter(Boolean)
                    .join(" "),
                  order.shipping_address?.country?.display_name,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {Boolean(order.shipping_address?.phone) && (
                <p>{order.shipping_address?.phone}</p>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden rounded-xs border border-grayscale-200 p-4">
            <div className="flex gap-4 items-center mb-8">
              <Icon name="receipt" />
              <p className="text-grayscale-500">Billing address</p>
            </div>
            <div>
              <p>
                {[
                  order.billing_address?.first_name,
                  order.billing_address?.last_name,
                ]
                  .filter(Boolean)
                  .join(" ")}
              </p>
              {Boolean(order.billing_address?.company) && (
                <p>{order.billing_address?.company}</p>
              )}
              <p>
                {[
                  order.billing_address?.address_1,
                  order.billing_address?.address_2,
                  [
                    order.billing_address?.postal_code,
                    order.billing_address?.city,
                  ]
                    .filter(Boolean)
                    .join(" "),
                  order.billing_address?.country?.display_name,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {Boolean(order.billing_address?.phone) && (
                <p>{order.billing_address?.phone}</p>
              )}
            </div>
          </div>
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4 flex flex-col gap-6">
          {order.items?.map((item) => (
            <OrderItem
              key={item.id}
              thumbnail={item.thumbnail || ""}
              product_handle={item.product_handle || ""}
              product_title={item.product_title || ""}
              title={item.title || ""}
              quantity={item.quantity || 0}
              variant={item.variant}
              //@ts-expect-error - to be removed when fulfilled_total is added to the type
              fulfilled_total={item.fulfilled_total || 0}
              unit_price={item.unit_price || 0}
              currencyCode={order.currency_code}
              className="flex gap-x-4 sm:gap-x-8 gap-y-6 pb-6 border-b border-grayscale-100 last:border-0 last:pb-0"
            />
          ))}
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4 flex max-sm:flex-col gap-y-4 gap-x-10 md:flex-wrap justify-between">
          <div className="flex items-center self-baseline gap-4">
            <Icon name="credit-card" />
            <div>
              <p className="text-grayscale-500">Payment</p>
            </div>
          </div>
          <OrderTotals order={order} />
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4">
          <div className="flex gap-4 items-center mb-6">
            <Icon name="undo" />
            <p className="text-grayscale-500">Returns</p>
          </div>
          {orderReturns && orderReturns.length > 0 && (
            <div className="flex flex-col gap-6 mb-4">
              {orderReturns.map((eachReturn, index) => (
                <div
                  key={eachReturn.id || `return-${index}`}
                  className="flex flex-col gap-4 p-4 rounded-xs border border-grayscale-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      {eachReturn.display_id && (
                        <p className="font-medium">
                          Return #{eachReturn.display_id}
                        </p>
                      )}
                      <p className="text-xs text-grayscale-500">
                        {new Date(eachReturn.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-right font-medium">
                      {convertToLocale({
                        currency_code: eachReturn.currency_code,
                        amount: calcExpectedRefundAmount(eachReturn),
                      })}
                    </p>
                  </div>
                  <div className="flex overflow-x-auto gap-3">
                    {eachReturn.items
                      ?.filter((item) => item.item.thumbnail)
                      .map((item) => (
                        <LocalizedLink
                          key={item.id}
                          href={`/products/${item.item.product_handle}`}
                          className="shrink-0 w-19 aspect-[3/4] rounded-2xs relative overflow-hidden"
                        >
                          <Image
                            src={item.item.thumbnail!}
                            alt={item.item.title}
                            fill
                            className="object-cover"
                          />
                        </LocalizedLink>
                      ))}
                  </div>
                  {eachReturn.id && (
                    <LocalizedButtonLink
                      href={`/account/my-orders/${order.id}/return/${eachReturn.id}`}
                      variant="outline"
                      size="sm"
                    >
                      View Details
                    </LocalizedButtonLink>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center gap-8">
            <p className="text-xs">
              Returns are available for the first 14 days after receiving your
              items.
            </p>
            {hasReturnableItemsInOrder && (
              <LocalizedButtonLink
                href={`/account/my-orders/${order.id}/return`}
                variant="outline"
                size="sm"
              >
                Start Return
              </LocalizedButtonLink>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
