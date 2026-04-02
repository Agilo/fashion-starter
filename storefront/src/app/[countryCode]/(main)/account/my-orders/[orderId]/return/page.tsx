import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCustomer } from "@lib/data/customer"
import { ReturnCreationTemplate } from "@modules/returns/templates/ReturnCreationTemplate"
import {
  fetchAndVerifyOrder,
  listReturnReasons,
  listReturnShippingOptions,
} from "@lib/data/returns"
import { hasReturnableItems, OrderWithReturns } from "@lib/util/returns"

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

  const order = (await fetchAndVerifyOrder(
    orderId,
    customer.email
  )) as OrderWithReturns & { cart: { id: string } }

  if (!order || !hasReturnableItems(order)) {
    notFound()
  }

  const [shippingOptions, returnReasons] = await Promise.all([
    listReturnShippingOptions(order.cart.id),
    listReturnReasons(),
  ])

  return (
    <ReturnCreationTemplate
      order={order}
      returnReasons={returnReasons}
      shippingOptions={shippingOptions}
      cartId={order?.cart?.id || ""}
    />
  )
}
