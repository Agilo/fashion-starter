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
): Promise<ProductSearchResult> => {}
