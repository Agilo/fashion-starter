import { Metadata } from "next"
import { redirect } from "next/navigation"

import { getCustomer } from "@lib/data/customer"
import { retrieveOrder } from "@lib/data/orders"
import { ReturnCreationTemplate } from "@modules/returns/templates/ReturnCreationTemplate"
import { listReturnReasons, listReturnShippingOptions } from "@lib/data/returns"
import { HttpTypes } from "@medusajs/types/dist/bundles"
import { hasReturnableItems } from "@lib/util/returns"

export const metadata: Metadata = {
  title: "Account - Return Items",
  description: "Request a return for your order",
}

type Props = {
  params: Promise<{ orderId: string }>
}

export default async function ReturnPage({ params }: Props) {
  const customer = await getCustomer().catch(() => null)

  if (!customer) {
    redirect("/")
  }

  const { orderId } = await params
  const order = (await retrieveOrder(orderId)) as
    | (HttpTypes.StoreOrder & { cart: { id: string } })
    | null

  if (!order) {
    redirect("/account/my-orders")
  }

  if (!hasReturnableItems(order)) {
    redirect(`/account/my-orders/${orderId}`)
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
