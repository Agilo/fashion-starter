import { Metadata } from "next"
import { notFound } from "next/navigation"

import { ReturnDetailsTemplate } from "@modules/returns/templates/ReturnDetailsTemplate"
import { getOrderReturns } from "@lib/util/returns"
import { Layout } from "@/components/Layout"
import { fetchAndVerifyOrder } from "@lib/data/returns"

export const metadata: Metadata = {
  title: "Return Details",
  description: "View your return request details",
}

export default async function ReturnDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>
  searchParams: Promise<{
    email: string
  }>
}) {
  const { orderId } = await params
  const { email } = await searchParams

  if (!orderId || !email) {
    notFound()
  }

  const order = await fetchAndVerifyOrder(orderId, email)

  if (!order) {
    notFound()
  }

  const orderReturns = getOrderReturns(order)

  if (!orderReturns || orderReturns.length === 0) {
    notFound()
  }

  return (
    <Layout>
      <ReturnDetailsTemplate returns={orderReturns} isGuest />
    </Layout>
  )
}
