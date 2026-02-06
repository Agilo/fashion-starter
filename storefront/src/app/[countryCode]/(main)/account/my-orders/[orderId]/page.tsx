import * as React from "react"
import { Metadata } from "next"
import { HttpTypes } from "@medusajs/types"

import { retrieveOrder } from "@lib/data/orders"
import { OrderTotals } from "@modules/order/components/OrderTotals"
import { OrderItem } from "@modules/order/components/item/OrderItem"
import { UiTag } from "@/components/ui/Tag"
import { UiTagList, UiTagListDivider } from "@/components/ui/TagList"
import { Icon } from "@/components/Icon"
import { ButtonLink } from "@/components/Button"
import { getCustomer } from "@lib/data/customer"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Account - Order Details",
  description: "Check your order history",
}

const OrderStatus: React.FC<{ order: HttpTypes.StoreOrder }> = ({ order }) => {
  if (order.fulfillment_status === "canceled") {
    return (
      <UiTagList>
        <UiTag iconName="close" isActive className="self-start mt-auto">
          Canceled
        </UiTag>
      </UiTagList>
    )
  }

  if (order.fulfillment_status === "delivered") {
    return (
      <UiTagList>
        <UiTag isActive iconName="package" className="self-start mt-auto">
          Packing
        </UiTag>
        <UiTagListDivider />
        <UiTag isActive iconName="truck" className="self-start mt-auto">
          Delivering
        </UiTag>
        <UiTagListDivider />
        <UiTag isActive iconName="check" className="self-start mt-auto">
          Delivered
        </UiTag>
      </UiTagList>
    )
  }

  if (
    order.fulfillment_status === "shipped" ||
    order.fulfillment_status === "partially_delivered"
  ) {
    return (
      <UiTagList>
        <UiTag isActive iconName="package" className="self-start mt-auto">
          Packing
        </UiTag>
        <UiTagListDivider />
        <UiTag isActive iconName="truck" className="self-start mt-auto">
          Delivering
        </UiTag>
        <UiTagListDivider />
        <UiTag iconName="check" className="self-start mt-auto">
          Delivered
        </UiTag>
      </UiTagList>
    )
  }

  return (
    <UiTagList>
      <UiTag isActive iconName="package" className="self-start mt-auto">
        Packing
      </UiTag>
      <UiTagListDivider />
      <UiTag iconName="truck" className="self-start mt-auto">
        Delivering
      </UiTag>
      <UiTagListDivider />
      <UiTag iconName="check" className="self-start mt-auto">
        Delivered
      </UiTag>
    </UiTagList>
  )
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
  const order = await retrieveOrder(orderId)

  return (
    <>
      <h1 className="text-md md:text-lg mb-8 md:mb-13">
        Order: {order.display_id}
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
          <div className="flex flex-wrap gap-x-10 gap-y-8 justify-between items-end w-full">
            <OrderStatus order={order} />
          </div>
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
          <div className="flex flex-wrap gap-8 items-center justify-between">
            <div>
              <div className="flex gap-4 items-center mb-4">
                <Icon name="undo" />
                <p className="text-grayscale-500">Returns</p>
              </div>
              <p className="text-xs">
                Returns are available for the first 14 days after receiving your
                items.
              </p>
            </div>
            {order.fulfillment_status === "delivered" && (
              <ButtonLink
                href={`/account/my-orders/${order.id}/return`}
                variant="outline"
                size="sm"
              >
                Start Return
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
