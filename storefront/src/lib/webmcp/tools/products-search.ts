import { StoreProduct } from "@medusajs/types"

interface ProductSearchParams {
  query?: string
  collection_ids?: string[]
  category_ids?: string[]
  type_ids?: string[]
  sort?: "latest_arrivals" | "lowest_price" | "highest_price"
  limit?: number
}

interface ProductSearchResult {
  products: Array<{
    id: string
    title: string
    handle: string
    thumbnail?: string
    price?: { amount: number; currency_code: string }
    materials: Array<{
      id: string
      name: string
      colors: Array<{ id: string; name: string; hex_code: string }>
    }>
    collection_ids?: string[]
    category_ids?: string[]
    type_id?: string
    tags?: string[]
    variants?: Array<{
      id: string
      title?: string
      inventory_quantity?: number | null
    }>
  }>
}

export const productsSearch = async (
  params: ProductSearchParams
): Promise<
  ProductSearchResult | { error: { code: string; message: string } }
> => {
  try {
    const limit = Math.min(params.limit || 12, 36)

    const queryParams = new URLSearchParams()

    if (params.query) {
      queryParams.append("q", params.query)
    }
    if (params.collection_ids) {
      params.collection_ids.forEach((id) =>
        queryParams.append("collection_id[]", id)
      )
    }
    if (params.category_ids) {
      params.category_ids.forEach((id) =>
        queryParams.append("category_id[]", id)
      )
    }
    if (params.type_ids) {
      params.type_ids.forEach((id) => queryParams.append("type_id[]", id))
    }

    queryParams.append("limit", limit.toString())

    const response = await fetch(
      `/api/store/products?${queryParams.toString()}`
    )

    if (!response.ok) {
      return {
        error: {
          code: "FETCH_FAILED",
          message: "Failed to fetch products",
        },
      }
    }

    const data = await response.json()
    console.log(data)

    return data
  } catch (err) {
    return {
      error: {
        code: "SEARCH_FAILED",
        message: err instanceof Error ? err.message : "Unknown error",
      },
    }
  }
}

const fetchFashionConfig = async (handle: string) => {
  const res = await fetch(`/api/store/custom/fashion/${handle}`)
  if (!res.ok) return null

  return res.json()
}

const mapProductsWithFashion = (product: StoreProduct, fashionConfig: any) => {}

export const productsSearchTool = {
  name: "products_search",
  description: "Search for products with filters and sorting",
  parameters: {
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
  },
  handler: productsSearch,
}
