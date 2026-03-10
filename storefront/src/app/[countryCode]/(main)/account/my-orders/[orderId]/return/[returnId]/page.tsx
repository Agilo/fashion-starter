import { Metadata } from "next"
import { redirect } from "next/navigation"

import { getCustomer } from "@lib/data/customer"
import { ReturnDetailsTemplate } from "@modules/returns/templates/ReturnDetailsTemplate"
import { retrieveOrder } from "@lib/data/orders"
import { getOrderReturns, type OrderWithReturns } from "@lib/util/returns"

export const metadata: Metadata = {
  title: "Account - Return Details",
  description: "View your return request details",
}

export default async function AccountReturnDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string; returnId: string }>
}) {
  const customer = await getCustomer().catch(() => null)

  if (!customer) {
    redirect("/")
  }

  const { orderId, returnId } = await params
  const order = (await retrieveOrder(orderId)) as OrderWithReturns

  if (!order) {
    redirect("/account/my-orders")
  }

  const orderReturns = getOrderReturns(order)

  const returnEntity = orderReturns?.find((r) => r.id === returnId)

  if (!returnEntity) {
    redirect(`/account/my-orders/${orderId}`)
  }

  return <ReturnDetailsTemplate returns={[returnEntity]} />
}
