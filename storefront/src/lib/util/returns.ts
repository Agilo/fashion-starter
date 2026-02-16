import { HttpTypes } from "@medusajs/types"

export type ItemWithDeliveryStatus = HttpTypes.StoreOrderLineItem & {
  deliveredQuantity: number
  returnableQuantity: number
  isDelivered: boolean
  isReturnable: boolean
}

export const calculateReturnableQuantity = (
  item: HttpTypes.StoreOrderLineItem
): number => {
  const deliveredQuantity = item.detail?.delivered_quantity || 0
  const returnRequestedQuantity = item.detail?.return_requested_quantity || 0
  const returnReceivedQuantity = item.detail?.return_received_quantity || 0
  const writtenOffQuantity = item.detail?.written_off_quantity || 0

  return Math.max(
    0,
    deliveredQuantity -
      returnRequestedQuantity -
      returnReceivedQuantity -
      writtenOffQuantity
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

export type OrderReturnStatus = {
  hasReturns: boolean
  totalDelivered: number
  totalReturnRequested: number
  totalReturnReceived: number
  isFullyReturned: boolean
  isPartiallyReturned: boolean
  hasReturnRequests: boolean
}

export const getOrderReturnStatus = (
  order: HttpTypes.StoreOrder
): OrderReturnStatus => {
  let totalDelivered = 0
  let totalReturnRequested = 0
  let totalReturnReceived = 0

  for (const item of order.items || []) {
    const detail = item.detail
    if (!detail) continue

    totalDelivered += detail.delivered_quantity || 0
    totalReturnRequested += detail.return_requested_quantity || 0
    totalReturnReceived += detail.return_received_quantity || 0
  }

  const hasReturns = totalReturnRequested > 0 || totalReturnReceived > 0
  const isFullyReturned =
    totalDelivered > 0 && totalReturnReceived >= totalDelivered
  const isPartiallyReturned =
    totalReturnReceived > 0 && totalReturnReceived < totalDelivered
  const hasReturnRequests = totalReturnRequested > 0

  return {
    hasReturns,
    totalDelivered,
    totalReturnRequested,
    totalReturnReceived,
    isFullyReturned,
    isPartiallyReturned,
    hasReturnRequests,
  }
}
