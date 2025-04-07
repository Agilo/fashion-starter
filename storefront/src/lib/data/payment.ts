import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

// Shipping actions
export const listCartPaymentMethods = async function (regionId: string) {
  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        query: { region_id: regionId },
        next: { tags: ["payment_providers"] },
        cache: "force-cache",
      }
    )
    .then(({ payment_providers }) => payment_providers)
    .catch(() => {
      return null
    })
}
