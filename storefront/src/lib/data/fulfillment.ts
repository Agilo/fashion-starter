import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

// Shipping actions
export const listCartShippingMethods = async function (cartId: string) {
  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(
      `/store/shipping-options`,
      {
        query: { cart_id: cartId },
        next: { tags: ["shipping"] },
        cache: "force-cache",
      }
    )
    .then(({ shipping_options }) => shipping_options)
    .catch(() => {
      return null
    })
}

export const calculatePriceForShippingOption = async function (
  shippingOptionId: string,
  cartId: string
): Promise<{ id: string; amount: number } | null> {
  return sdk.client
    .fetch<{ price: { amount: number } }>(
      `/store/shipping-options/${shippingOptionId}/calculate`,
      {
        method: "POST",
        body: { cart_id: cartId },
        next: { tags: ["shipping"] },
      }
    )
    .then(({ price }) => ({
      id: shippingOptionId,
      amount: price.amount,
    }))
    .catch(() => {
      return null
    })
}
