import { HttpTypes } from "@medusajs/types"

export type OrderWithReturns = HttpTypes.StoreOrder & {
  returns?: HttpTypes.StoreReturn[]
}

export const getReturnCoverage = (
  order: OrderWithReturns
): {
  hasAnyReturnedItem: boolean
  areAllItemsReturned: boolean
} => {
  const items = order.items || []
  const returnedItemIds = new Set(
    (order.returns || []).flatMap((ret) =>
      (ret.items || []).map((retItem) => retItem.item_id)
    )
  )

  return {
    hasAnyReturnedItem: items.some((item) => returnedItemIds.has(item.id)),
    areAllItemsReturned:
      items.length > 0 && items.every((item) => returnedItemIds.has(item.id)),
  }
}

export type ItemWithDeliveryStatus = HttpTypes.StoreOrderLineItem & {
  deliveredQuantity: number
  returnableQuantity: number
  isDelivered: boolean
  isReturnable: boolean
}

export const calculateReturnableQuantity = (
  item: HttpTypes.StoreOrderLineItem
): number => {
  const {
    delivered_quantity = 0,
    return_requested_quantity = 0,
    return_received_quantity = 0,
    written_off_quantity = 0,
  } = item.detail || {}

  return Math.max(
    0,
    delivered_quantity -
      return_requested_quantity -
      return_received_quantity -
      written_off_quantity
  )
}

export const isItemReturnable = (
  item: HttpTypes.StoreOrderLineItem
): boolean => {
  return calculateReturnableQuantity(item) > 0
}

export const hasReturnableItems = (order: HttpTypes.StoreOrder): boolean => {
  return order.items?.some(isItemReturnable) || false
}

export const enhanceItemsWithReturnStatus = (
  items: HttpTypes.StoreOrderLineItem[]
): ItemWithDeliveryStatus[] => {
  return items.map((item) => {
    const deliveredQuantity = item.detail?.delivered_quantity || 0
    const returnableQuantity = calculateReturnableQuantity(item)

    return {
      ...item,
      deliveredQuantity,
      returnableQuantity,
      isDelivered: deliveredQuantity > 0,
      isReturnable: returnableQuantity > 0,
    }
  })
}

export type ReturnItemWithOrderItem = HttpTypes.StoreReturnItem & {
  item: HttpTypes.StoreOrderLineItem | null
}

export type ReturnWithOrderItems = Omit<HttpTypes.StoreReturn, "items"> & {
  items: ReturnItemWithOrderItem[]
  currency_code: string
}

export const getOrderReturns = (
  order: OrderWithReturns
): ReturnWithOrderItems[] => {
  return (
    order.returns?.map((ret) => ({
      ...(ret as ReturnWithOrderItems),
      currency_code: order.currency_code,
    })) || []
  )
}
