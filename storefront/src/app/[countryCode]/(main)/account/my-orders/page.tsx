import * as React from "react"
import { Metadata } from "next"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { twMerge } from "tailwind-merge"

import { listOrders } from "@lib/data/orders"
import { Pagination } from "@modules/store/components/pagination"
import { ButtonLink } from "@/components/Button"
import { UiTag } from "@/components/ui/Tag"
import { LocalizedLink } from "@/components/LocalizedLink"
import { getCustomer } from "@lib/data/customer"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Account - Orders",
  description: "Check your order history",
}

const OrderStatus: React.FC<{
  order: HttpTypes.StoreOrder
  className?: string
}> = ({ order, className }) => {
  if (order.fulfillment_status === "canceled") {
    return (
      <UiTag
        iconName="close"
        isActive
        className={twMerge("self-start mt-auto", className)}
      >
        Canceled
      </UiTag>
    )
  }

  if (order.fulfillment_status === "delivered") {
    return (
      <UiTag
        iconName="check"
        isActive
        className={twMerge("self-start mt-auto", className)}
      >
        Delivered
      </UiTag>
    )
  }

  if (
    order.fulfillment_status === "shipped" ||
    order.fulfillment_status === "partially_delivered"
  ) {
    return (
      <UiTag
        iconName="truck"
        isActive
        className={twMerge("self-start mt-auto", className)}
      >
        Delivering
      </UiTag>
    )
  }

  return (
    <UiTag
      iconName="package"
      isActive
      className={twMerge("self-start mt-auto", className)}
    >
      Packing
    </UiTag>
  )
}

type PageProps = {
  searchParams: Promise<{
    page?: string
  }>
}

const ORDERS_PER_PAGE = 6

export default async function AccountMyOrdersPage({ searchParams }: PageProps) {
  const { page } = await searchParams

  const customer = await getCustomer().catch(() => null)

  if (!customer) {
    redirect(`/`)
  }

  const pageNumber = page ? parseInt(page, 10) : 1
  const { orders, count } = await listOrders(
    ORDERS_PER_PAGE,
    (pageNumber - 1) * ORDERS_PER_PAGE
  )
  const totalPages = Math.ceil(count / ORDERS_PER_PAGE)

  return (
    <>
      <h1 className="text-md md:text-lg mb-8 md:mb-13">My orders</h1>
      {orders.length > 0 ? (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-8 sm:gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xs border border-grayscale-200 flex flex-col gap-6 sm:gap-8 md:gap-6 lg:gap-8 p-4"
              >
                <div className="flex max-sm:flex-col-reverse md:flex-col-reverse lg:flex-row gap-y-6 gap-x-10 justify-between">
                  <div className="flex-shrink-0">
                    <OrderStatus order={order} className="sm:hidden mb-6" />
                    <div className="mb-2">
                      <LocalizedLink
                        href={`/account/my-orders/${order.id}`}
                        className="text-md"
                      >
                        <span className="font-semibold">Order:</span>{" "}
                        {order.display_id}
                      </LocalizedLink>
                    </div>
                    <p className="text-grayscale-500">
                      Order date:{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-3 overflow-x-auto sm:max-w-91 md:max-w-full lg:max-w-91">
                    {order.items
                      ?.filter((item) => item.thumbnail)
                      .map((item) => (
                        <LocalizedLink
                          key={item.id}
                          href={`/products/${item.product_handle}`}
                          className="shrink-0 w-19 aspect-[3/4] rounded-2xs relative overflow-hidden"
                        >
                          <Image
                            src={item.thumbnail!}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </LocalizedLink>
                      ))}
                  </div>
                </div>
                <div className="flex max-sm:flex-col justify-between gap-6">
                  <OrderStatus order={order} className="max-sm:hidden" />
                  <div className="flex flex-wrap gap-3 sm:self-end md:self-start lg:self-end">
                    {order.fulfillment_status === "delivered" && (
                      <>
                        <ButtonLink
                          href={`/account/my-orders/${order.id}/return`}
                          variant="outline"
                          size="md"
                          className="sm:hidden"
                        >
                          Return
                        </ButtonLink>
                        <ButtonLink
                          href={`/account/my-orders/${order.id}/return`}
                          variant="outline"
                          size="sm"
                          className="max-sm:hidden"
                        >
                          Return
                        </ButtonLink>
                      </>
                    )}
                    <ButtonLink
                      href={`/account/my-orders/${order.id}`}
                      variant="outline"
                      size="md"
                      className="sm:hidden"
                    >
                      Check details
                    </ButtonLink>
                    <ButtonLink
                      href={`/account/my-orders/${order.id}`}
                      variant="outline"
                      size="sm"
                      className="max-sm:hidden"
                    >
                      Check details
                    </ButtonLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination page={pageNumber} totalPages={totalPages} />
          )}
        </div>
      ) : (
        <p className="text-md mt-16">You haven&apos;t ordered anything yet</p>
      )}
    </>
  )
}
