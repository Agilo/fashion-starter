import { Metadata } from "next"
import { redirect } from "next/navigation"

import { ReturnDetailsTemplate } from "@modules/returns/templates/ReturnDetailsTemplate"
import { retrieveOrder } from "@lib/data/orders"

export const metadata: Metadata = {
  title: "Return Details",
  description: "View your return request details",
}

type Props = {
  params: Promise<{ orderId: string }>
}

export default async function ReturnDetailsPage({ params }: Props) {
  const { orderId } = await params

  const order = await retrieveOrder(orderId)

  if (!order) {
    redirect("/returns/track")
  }

  return <ReturnDetailsTemplate order={order} isGuest />
}
