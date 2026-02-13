import { getProductsListWithSort } from "@lib/data/products"
import { MeiliSearchProductHit, searchClient } from "@lib/search-client"
import { getBaseURL } from "@lib/util/env"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { WebMCPTool, WebMCPToolResult } from "../types"

export interface ProductSearchInput {
  query?: string
  collection_ids?: string[]
  category_ids?: string[]
  type_ids?: string[]
  sort?: "latest_arrivals" | "lowest_price" | "highest_price"
  limit?: number
}

interface ProductSearchData {
  products: Array<{
    id: string
    title: string
    handle: string
    thumbnail?: string
    price?: { amount: number; currency_code: string }
    collection_ids?: string[]
    category_ids?: string[]
    type_id?: string
    tags?: string[]
    variants?: Array<{
      id: string
      title?: string
      inventory_quantity?: number | null
    }>
    options?: Array<{
      id: string
      title: string
      values?: Array<{
        id: string
        value: string
      }>
    }>
  }>
}

export const productsSearch = async (
  params: ProductSearchInput
): Promise<WebMCPToolResult<ProductSearchData>> => {
  const pathNameParts = window.location.href
    .replace(getBaseURL(), "")
    .replace(/^\//, "")
    .split("/")
  const countryCode = pathNameParts[0]

  if (!countryCode) {
    return {
      ok: false,
      error: {
        code: "INVALID_COUNTRY_CODE",
        message: "Your country code is invalid.",
      },
    }
  }

  try {
    const results = params.query
      ? await searchClient
          .index("products")
          .search<MeiliSearchProductHit>(params.query)
      : null

    const queryParams: HttpTypes.StoreProductListParams = {
      limit: Math.min(36, params.limit || 12),
    }

    if (params.collection_ids && params.collection_ids.length) {
      queryParams["collection_id"] = params.collection_ids
    }

    if (params.category_ids && params.category_ids.length) {
      queryParams["category_id"] = params.category_ids
    }

    if (params.type_ids) {
      queryParams["type_id"] = params.type_ids
    }

    if (results) {
      queryParams["id"] = results.hits.map((h) => h.id)
    }

    if (params.sort === "latest_arrivals") {
      queryParams["order"] = "created_at"
    }

    const medusaProducts = await getProductsListWithSort({
      countryCode,
      queryParams,
      sortBy:
        params.sort === "highest_price"
          ? "price_desc"
          : params.sort === "lowest_price"
            ? "price_asc"
            : "created_at",
    })

    return {
      ok: true,
      data: {
        products: medusaProducts.response.products.map((product) => {
          const { cheapestPrice } = getProductPrice({
            product,
          })

          return {
            id: product.id,
            title: product.title,
            handle: product.handle,
            thumbnail: product.thumbnail ?? undefined,
            price: cheapestPrice
              ? {
                  amount: cheapestPrice.calculated_price_number,
                  currency_code: cheapestPrice.currency_code!,
                }
              : undefined,
            variants: product.variants?.map((variant) => ({
              id: variant.id,
              title: variant.title ?? undefined,
              inventory_quantity: variant.inventory_quantity,
            })),
            options: product.options?.map((option) => ({
              id: option.id,
              title: option.title,
              values: option.values?.map((valopt) => ({
                id: valopt.id,
                value: valopt.value,
              })),
            })),
            category_ids:
              product.categories?.map((category) => category.id) ?? [],
            collection_ids: product.collection ? [product.collection.id] : [],
            tags: product.tags?.map((tag) => tag.value) ?? [],
            type_id: product.type_id ?? undefined,
          }
        }),
      },
      meta: {
        tool: "products.search",
      },
    }
  } catch (err) {
    return {
      ok: false,
      error: {
        code: "SEARCH_FAILED",
        message: err instanceof Error ? err.message : "Unknown error",
      },
    }
  }
}

export const productsSearchTool: WebMCPTool<
  ProductSearchInput,
  ProductSearchData
> = {
  name: "products.search",
  description: "Search for products with filters and sorting",
  annotations: {
    readOnlyHint: true,
  },
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query" },
      collection_ids: { type: "array", items: { type: "string" } },
      category_ids: { type: "array", items: { type: "string" } },
      type_ids: { type: "array", items: { type: "string" } },
      sort: {
        type: "string",
        enum: ["latest_arrivals", "lowest_price", "highest_price"],
      },
      limit: { type: "number", minimum: 1, maximum: 36 },
    },
    additionalProperties: false,
  },
  handler: productsSearch,
}
