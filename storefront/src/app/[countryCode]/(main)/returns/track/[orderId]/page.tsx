import { Metadata } from "next"
import { redirect } from "next/navigation"

import { ReturnDetailsTemplate } from "@modules/returns/templates/ReturnDetailsTemplate"
import { retrieveOrder } from "@lib/data/orders"
import { getOrderReturns, type OrderWithReturns } from "@lib/util/returns"

export const metadata: Metadata = {
  title: "Return Details",
  description: "View your return request details",
}

export default async function ReturnDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params

  const order = (await retrieveOrder(orderId)) as OrderWithReturns

  if (!order) {
    redirect("/returns/track")
  }

  const orderReturns = getOrderReturns(order)

  if (!orderReturns || orderReturns.length === 0) {
    redirect("/returns/track")
  }

  return <ReturnDetailsTemplate returns={orderReturns} isGuest />
}
