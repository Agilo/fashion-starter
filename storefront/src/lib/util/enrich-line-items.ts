import "server-only"
import { HttpTypes } from "@medusajs/types"
import { omit } from "lodash"

import { getProductsById } from "@lib/data/products"

export async function enrichLineItems<
  T extends HttpTypes.StoreCartLineItem[] | HttpTypes.StoreOrderLineItem[],
>(lineItems: T | null, regionId: string): Promise<T> {
  if (!lineItems) return [] as unknown as T

  // Prepare query parameters
  const queryParams = {
    ids: lineItems.map((lineItem) => lineItem.product_id!),
    regionId,
  }

  // Fetch products by their IDs
  const products = await getProductsById(queryParams)
  // If there are no line items or products, return an empty array
  if (!lineItems?.length || !products) {
    return [] as unknown as T
  }

  // Enrich line items with product and variant information
  const enrichedItems = lineItems.map((item) => {
    const product = products.find((p) => p.id === item.product_id)
    const variant = product?.variants?.find((v) => v.id === item.variant_id)

    // If product or variant is not found, return the original item
    if (!product || !variant) {
      return item
    }

    // If product and variant are found, enrich the item
    return {
      ...item,
      variant: {
        ...variant,
        product: omit(product, "variants"),
      },
    }
  }) as T

  return enrichedItems
}
