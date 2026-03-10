import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCustomer } from "@lib/data/customer"
import { ReturnDetailsTemplate } from "@modules/returns/templates/ReturnDetailsTemplate"
import { getOrderReturns, type OrderWithReturns } from "@lib/util/returns"
import { fetchAndVerifyOrder } from "@lib/data/returns"

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

  const { orderId, returnId } = await params

  if (!customer || !orderId || !returnId) {
    notFound()
  }

  const order = (await fetchAndVerifyOrder(
    orderId,
    customer.email
  )) as OrderWithReturns & { cart: { id: string } }

  if (!order) {
    notFound()
  }

  const orderReturns = getOrderReturns(order)

  const returnEntity = orderReturns?.find((r) => r.id === returnId)

  if (!returnEntity) {
    notFound()
  }

  return <ReturnDetailsTemplate returns={[returnEntity]} />
}
