import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { retrieveOrder } from "@lib/data/orders"
import { ReturnCreationTemplate } from "@modules/returns/templates/ReturnCreationTemplate"
import { Layout } from "@/components/Layout"
import { listReturnReasons, listReturnShippingOptions } from "@lib/data/returns"
import { HttpTypes } from "@medusajs/types"
import { hasReturnableItems } from "@lib/util/returns"

export const metadata: Metadata = {
  title: "Return Items - Guest",
  description: "Request a return for your order",
}

type Props = {
  searchParams: Promise<{
    orderId?: string
    email?: string
  }>
}

export default async function GuestReturnCreatePage({ searchParams }: Props) {
  const { orderId, email } = await searchParams

  if (!orderId || !email) {
    notFound()
  }

  const order = (await retrieveOrder(orderId)) as
    | (HttpTypes.StoreOrder & { cart: { id: string } })
    | null

  if (!order || !hasReturnableItems(order)) {
    redirect("/returns")
  }

  const [shippingOptions, returnReasons] = await Promise.all([
    listReturnShippingOptions(order.cart.id),
    listReturnReasons(),
  ])

  return (
    <Layout>
      <ReturnCreationTemplate
        order={order}
        returnReasons={returnReasons}
        shippingOptions={shippingOptions}
        cartId={order.cart.id}
        isGuest
      />
    </Layout>
  )
}
