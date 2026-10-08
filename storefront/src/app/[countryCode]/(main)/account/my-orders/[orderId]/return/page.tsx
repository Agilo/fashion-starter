import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCustomer } from "@lib/data/customer"
import { ReturnCreationTemplate } from "@modules/returns/templates/ReturnCreationTemplate"
import {
  fetchAndVerifyOrder,
  listReturnReasons,
  listReturnShippingOptions,
} from "@lib/data/returns"
import { OrderWithReturns } from "@lib/util/returns"

export const metadata: Metadata = {
  title: "Account - Return Items",
  description: "Request a return for your order",
}

export default async function ReturnPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const customer = await getCustomer().catch(() => null)

  const { orderId } = await params

  if (!customer || !orderId) {
    notFound()
  }

  const order = (await fetchAndVerifyOrder(orderId, customer.email)) as
    | (OrderWithReturns & { cart?: { id: string } | null })
    | null

  if (!order) {
    notFound()
  }

  const cartId = order.cart?.id

  const [shippingOptions, returnReasons] = await Promise.all([
    cartId ? listReturnShippingOptions(cartId) : [],
    listReturnReasons(),
  ])

  return (
    <ReturnCreationTemplate
      order={order}
      returnReasons={returnReasons}
      shippingOptions={shippingOptions}
      cartId={cartId ?? ""}
    />
  )
}
