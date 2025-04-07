"use server"

import { cache } from "react"
import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { enrichLineItems } from "@lib/util/enrich-line-items"
import { getAuthHeaders } from "@lib/data/cookies"
import { HttpTypes } from "@medusajs/types"

export const retrieveOrder = cache(async function (id: unknown) {
  if (typeof id !== "string") {
    throw new Error("Invalid order id")
  }

  const order = await sdk.client
    .fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${id}`, {
      query: { fields: "*payment_collections.payments" },
      next: { tags: ["orders"] },
      headers: { ...(await getAuthHeaders()) },
      cache: "force-cache",
    })
    .then(({ order }) => order)
    .catch((err) => medusaError(err))

  if (order.items?.length && order.region_id) {
    order.items = await enrichLineItems(order.items, order.region_id)
  }

  return order
})

export const listOrders = async function (
  limit: number = 10,
  offset: number = 0
) {
  if (
    typeof limit !== "number" ||
    typeof offset !== "number" ||
    limit < 1 ||
    offset < 0 ||
    limit > 100 ||
    !Number.isSafeInteger(offset)
  ) {
    throw new Error("Invalid input data")
  }

  return sdk.client
    .fetch<HttpTypes.StoreOrderListResponse>(`/store/orders`, {
      query: { limit, offset, order: "-created_at" },
      next: { tags: ["orders"] },
      headers: { ...(await getAuthHeaders()) },
      cache: "force-cache",
    })
    .catch((err) => medusaError(err))
}
