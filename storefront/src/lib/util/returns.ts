import { HttpTypes } from "@medusajs/types"

export type OrderWithReturns = HttpTypes.StoreOrder & {
  returns?: Omit<ReturnWithOrderItems, "currency_code">[]
}

export const getReturnCoverage = (
  order: OrderWithReturns
): {
  hasAnyReturnedItem: boolean
  areAllItemsReturned: boolean
} => {
  const items = order.items || []

  // Sum up returned quantities per item_id
  const returnedQuantities = new Map<string, number>()
  for (const ret of order.returns || []) {
    for (const retItem of ret.items || []) {
      const current = returnedQuantities.get(retItem.item_id) || 0
      returnedQuantities.set(retItem.item_id, current + retItem.quantity)
    }
  }

  const hasAnyReturnedItem = items.some(
    (item) => (returnedQuantities.get(item.id) || 0) > 0
  )

  const areAllItemsReturned =
    items.length > 0 &&
    items.every(
      (item) => (returnedQuantities.get(item.id) || 0) >= item.quantity
    )

  return {
    hasAnyReturnedItem,
    areAllItemsReturned,
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

export type ReturnItemWithLineItem = HttpTypes.StoreReturnItem & {
  item: HttpTypes.StoreOrderLineItem
}

export type ReturnWithOrderItems = Omit<HttpTypes.StoreReturn, "items"> & {
  items: ReturnItemWithLineItem[]
  currency_code: string
}

export const getOrderReturns = (
  order: OrderWithReturns
): ReturnWithOrderItems[] => {
  const orderItemsById = new Map(
    (order.items || []).map((item) => [item.id, item])
  )

  return (
    order.returns?.map((ret) => ({
      ...(ret as ReturnWithOrderItems),
      currency_code: order.currency_code,
      items: ((ret as ReturnWithOrderItems).items || []).map((retItem) => ({
        ...retItem,
        item: orderItemsById.get(retItem.item_id) ?? retItem.item,
      })),
    })) || []
  )
}

export const calcReturnItemAmount = (
  returnItem: ReturnWithOrderItems["items"][number]
): number => {
  const item = returnItem.item
  if (!item) return 0
  const totalAdjustments =
    item.adjustments?.reduce((s, a) => s + a.amount, 0) ?? 0
  const discountedUnitPrice = item.unit_price - totalAdjustments / item.quantity
  return discountedUnitPrice * returnItem.quantity
}

export const calcExpectedRefundAmount = (
  returnEntity: ReturnWithOrderItems
): number =>
  returnEntity.items.reduce((sum, ri) => sum + calcReturnItemAmount(ri), 0)
