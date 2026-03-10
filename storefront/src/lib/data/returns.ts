"use server"

import { redirect } from "next/navigation"
import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "@lib/data/cookies"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { hasReturnableItems, OrderWithReturns } from "@lib/util/returns"

export const listReturnReasons = async () => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("return-reasons")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreReturnReasonListResponse>(`/store/return-reasons`, {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ return_reasons }) => return_reasons)
    .catch((err) => medusaError(err))
}

export const listReturnShippingOptions = async (cartId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("shipping-options")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(
      `/store/shipping-options`,
      {
        method: "GET",
        query: {
          cart_id: cartId,
          is_return: true,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ shipping_options }) => shipping_options)
    .catch(() => {
      return []
    })
}

export const createReturnRequest = async (
  state: {
    success: boolean
    error: string | null
    return: HttpTypes.StoreReturn | null
  },
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  return: HttpTypes.StoreReturn | null
}> => {
  const orderId = formData.get("order_id") as string
  const items = JSON.parse(formData.get("items") as string)
  const returnShippingOptionId = formData.get(
    "return_shipping_option_id"
  ) as string
  const locationId = formData.get("location_id") as string

  if (!orderId || !items || !returnShippingOptionId) {
    return {
      success: false,
      error: "Order ID, items, and return shipping option are required",
      return: null,
    }
  }

  const headers = await getAuthHeaders()

  return await sdk.client
    .fetch<HttpTypes.StoreReturnResponse>(`/store/returns`, {
      method: "POST",
      body: {
        order_id: orderId,
        items,
        return_shipping: {
          option_id: returnShippingOptionId,
        },
        location_id: locationId,
      },
      headers,
    })
    .then(({ return: returnData }) => ({
      success: true,
      error: null,
      return: returnData,
    }))
    .catch((err) => ({
      success: false,
      error: err.message,
      return: null,
    }))
}

export const fetchAndVerifyOrder = async (
  orderId: string,
  email: string
): Promise<OrderWithReturns> => {
  const order = await sdk.client
    .fetch<{ order: OrderWithReturns }>(`/store/orders/${orderId}`, {
      method: "GET",
      query: {
        fields:
          "*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product,*items.adjustments,+cart.id,+items.refundable_total_per_unit,+items.discount_total,*returns,*returns.*,+summary",
      },
      cache: "no-store",
    })
    .then(({ order }) => order)

  if (order.email?.toLowerCase() !== email.toLowerCase()) {
    throw new Error("Order not found. Please check your details and try again.")
  }

  return order
}

export const verifyGuestOrderAccess = async (
  orderId: string,
  email: string,
  countryCode: string
) => {
  const order = await fetchAndVerifyOrder(orderId, email)

  if (!hasReturnableItems(order)) {
    throw new Error("This order has no items available for return.")
  }

  const params = new URLSearchParams({ email })

  redirect(`/${countryCode}/returns/create/${orderId}?${params.toString()}`)
}

export const trackGuestReturn = async (
  orderId: string,
  email: string,
  countryCode: string
) => {
  const order = await fetchAndVerifyOrder(orderId, email)

  if (!order.returns || order.returns.length === 0) {
    throw new Error(
      "No returns found for this order. Please check your details and try again."
    )
  }

  const params = new URLSearchParams({ email })

  redirect(`/${countryCode}/returns/track/${orderId}?${params.toString()}`)
}
