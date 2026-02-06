import { Metadata } from "next"
import { redirect } from "next/navigation"

import { getCustomer } from "@lib/data/customer"
import { ReturnTrackingTemplate } from "@modules/returns/templates/ReturnTrackingTemplate"

export const metadata: Metadata = {
  title: "Account - Return Details",
  description: "View your return request details",
}

type Props = {
  params: Promise<{ returnId: string }>
}

// Mock function to get return data
// In a real app, this would fetch from the API
async function getReturnData(returnId: string) {
  // Mock data for demo
  return {
    id: returnId,
    orderId: "order_123",
    orderDisplayId: 1234,
    status: "approved" as const,
    createdAt: "2026-01-28T10:00:00Z",
    items: [
      {
        id: "item_1",
        title: "Classic T-Shirt - Black / M",
        productTitle: "Classic T-Shirt",
        product_title: "Classic T-Shirt",
        product_handle: "classic-t-shirt",
        thumbnail:
          "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
        quantity: 1,
        unitPrice: 2900,
        reason: "size_issue" as const,
        variant: {
          options: [
            {
              id: "opt_1",
              option: { title: "Color" },
              value: "Black",
            },
            {
              id: "opt_2",
              option: { title: "Size" },
              value: "M",
            },
          ],
        },
      },
    ],
    totalRefund: 2900,
    currencyCode: "eur",
    refundMethod: "original_payment" as const,
    shippingMethod: "prepaid_label",
    trackingNumber: undefined,
    estimatedRefundDate: "2026-02-10",
  }
}

export default async function AccountReturnPage({ params }: Props) {
  const customer = await getCustomer().catch(() => null)

  if (!customer) {
    redirect("/")
  }

  const { returnId } = await params
  const returnData = await getReturnData(returnId)

  if (!returnData) {
    redirect("/account/my-orders")
  }

  return <ReturnTrackingTemplate returnData={returnData} />
}
