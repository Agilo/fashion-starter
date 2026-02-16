"use server"

import { redirect } from "next/navigation"
import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "@lib/data/cookies"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"

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

export const verifyGuestOrderAccess = async (
  orderId: string,
  email: string
) => {
  try {
    const order = await sdk.client
      .fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${orderId}`, {
        method: "GET",
        cache: "no-store",
      })
      .then(({ order }) => order)

    if (order.email?.toLowerCase() !== email.toLowerCase()) {
      throw new Error(
        "Order not found. Please check your order ID and email address."
      )
    }

    const hasReturnable = order.items?.some((item) => {
      const deliveredQty = item.detail?.delivered_quantity || 0
      const returnRequestedQty = item.detail?.return_requested_quantity || 0
      const returnReceivedQty = item.detail?.return_received_quantity || 0
      const writtenOffQty = item.detail?.written_off_quantity || 0
      return (
        deliveredQty - returnRequestedQty - returnReceivedQty - writtenOffQty >
        0
      )
    })

    if (!hasReturnable) {
      throw new Error("This order has no items available for return.")
    }

    const params = new URLSearchParams({ orderId, email })
    redirect(`/returns/create?${params.toString()}`)
  } catch (err) {
    if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
      throw err
    }
    throw new Error(
      err instanceof Error
        ? err.message
        : "Unable to verify order. Please check your details and try again."
    )
  }
}
