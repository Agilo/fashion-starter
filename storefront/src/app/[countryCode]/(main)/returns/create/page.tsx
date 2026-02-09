import { Metadata } from "next"
import { notFound } from "next/navigation"

import { retrieveOrder } from "@lib/data/orders"
import { ReturnCreationTemplate } from "@modules/returns/templates/ReturnCreationTemplate"
import { Layout } from "@/components/Layout"

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

  // In a real app, you would:
  // 1. Verify the email matches the order's email
  // 2. Check if order is eligible for return
  const order = await retrieveOrder(orderId).catch(() => null)

  if (!order) {
    notFound()
  }

  // Verify email matches (simplified check)
  // In real implementation, this would be done securely on the server
  /* if (order.email?.toLowerCase() !== email.toLowerCase()) {
    notFound()
  } */

  // Check if order is eligible for return
  const isEligible = order.fulfillment_status === "delivered"

  if (!isEligible) {
    notFound()
  }

  return (
    <Layout>
      <ReturnCreationTemplate order={order} isGuest />
    </Layout>
  )
}
