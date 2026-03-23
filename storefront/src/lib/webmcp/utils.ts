import {
  StoreCart,
  StoreCartLineItem,
  StoreCartPromotion,
} from "@medusajs/types"

export const mapCartToResult = (cart: StoreCart) => {
  return {
    cart: {
      id: cart.id,
      currency_code: cart.currency_code,
      subtotal: cart.subtotal ?? 0,
      total: cart.total ?? 0,
      discount_total: cart.discount_total,
      items:
        cart.items?.map((item: StoreCartLineItem) => ({
          id: item.id,
          title: item.title,
          variant_id: item.variant_id ?? "",
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total ?? 0,
        })) || [],
      discount_codes:
        cart.promotions
          ?.map((p: StoreCartPromotion) => p.code)
          .filter((code): code is string => code !== undefined) || [],
    },
  }
}
