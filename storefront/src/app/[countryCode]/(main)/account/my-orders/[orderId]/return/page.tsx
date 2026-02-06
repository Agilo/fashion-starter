import { Metadata } from "next"
import { redirect } from "next/navigation"

import { getCustomer } from "@lib/data/customer"
import { retrieveOrder } from "@lib/data/orders"
import { ReturnCreationTemplate } from "@modules/returns/templates/ReturnCreationTemplate"

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
  const order = await retrieveOrder(orderId)

  if (!order) {
    redirect("/account/my-orders")
  }

  const isEligible = order.fulfillment_status === "delivered"

  if (!isEligible) {
    redirect(`/account/my-orders/${orderId}`)
  }

  return <ReturnCreationTemplate order={order} />
}
