import { Metadata } from "next"
import { notFound } from "next/navigation"

import { ReturnCreationTemplate } from "@modules/returns/templates/ReturnCreationTemplate"
import { Layout } from "@/components/Layout"
import {
  fetchAndVerifyOrder,
  listReturnReasons,
  listReturnShippingOptions,
} from "@lib/data/returns"
import { OrderWithReturns } from "@lib/util/returns"

export const metadata: Metadata = {
  title: "Return Items - Guest",
  description: "Request a return for your order",
}

export default async function GuestReturnCreatePage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>
  searchParams: Promise<{
    orderId?: string
    email?: string
  }>
}) {
  const { orderId } = await params
  const { email } = await searchParams

  if (!orderId || !email) {
    notFound()
  }

  const order = (await fetchAndVerifyOrder(orderId, email)) as
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
    <Layout>
      <ReturnCreationTemplate
        order={order}
        returnReasons={returnReasons}
        shippingOptions={shippingOptions}
        cartId={cartId ?? ""}
        isGuest
      />
    </Layout>
  )
}
