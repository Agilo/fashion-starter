interface CartManageParams {
  action: "add" | "remove" | "update" | "view"
  variant_id?: string
  quantity?: number
  line_id?: string
}

interface CartSnapshot {
  cart: {
    id: string
    currency_code: string
    subtotal: number
    total: number
    discount_total?: number
    items: Array<{
      id: string
      title: string
      variant_id: string
      quantity: number
      unit_price: number
      total: number
    }>
    discount_codes?: string[]
  }
}

export const cartManage = async (
  params: CartManageParams
): Promise<CartSnapshot> => {}
