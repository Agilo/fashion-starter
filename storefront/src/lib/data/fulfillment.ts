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
