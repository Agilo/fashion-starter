import { Metadata } from "next"
import { redirect } from "next/navigation"

import { getCustomer } from "@lib/data/customer"
import { ReturnDetailsTemplate } from "@modules/returns/templates/ReturnDetailsTemplate"
import { retrieveOrder } from "@lib/data/orders"

export const metadata: Metadata = {
  title: "Account - Return Details",
  description: "View your return request details",
}

export default async function AccountReturnDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const customer = await getCustomer().catch(() => null)

  if (!customer) {
    redirect("/")
  }

  const { orderId } = await params
  const order = await retrieveOrder(orderId)

  if (!order) {
    redirect("/account/my-orders")
  }

  return <ReturnDetailsTemplate order={order} />
}
