import { UiTag } from "@/components/ui/Tag"
import { HttpTypes, StoreReturn } from "@medusajs/types"
import { twMerge } from "tailwind-merge"

export const OrderStatusTag: React.FC<{
  order: HttpTypes.StoreOrder & { returns?: StoreReturn[] }
  className?: string
}> = ({ order, className }) => {
  const orderItemIds = new Set((order.items || []).map((item) => item.id))
  const returnedItemIds = new Set(
    (order.returns || []).flatMap((ret) =>
      (ret.items || []).map((retItem) => retItem.item_id)
    )
  )

  const hasAnyReturnedItem = Array.from(orderItemIds).some((id) =>
    returnedItemIds.has(id)
  )
  const areAllItemsReturned =
    orderItemIds.size > 0 &&
    Array.from(orderItemIds).every((id) => returnedItemIds.has(id))

  if (
    order.fulfillment_status === "delivered" &&
    order.returns?.some((r) => r.status === "requested")
  ) {
    return (
      <UiTag
        iconName="refresh"
        isActive
        className={twMerge("self-start mt-auto", className)}
      >
        Return in Progress
      </UiTag>
    )
  }

  if (order.fulfillment_status === "delivered" && areAllItemsReturned) {
    return (
      <UiTag
        iconName="refresh"
        isActive
        className={twMerge("self-start mt-auto", className)}
      >
        Fully Returned
      </UiTag>
    )
  }

  if (
    order.fulfillment_status === "delivered" &&
    hasAnyReturnedItem &&
    !areAllItemsReturned
  ) {
    return (
      <UiTag
        iconName="refresh"
        isActive
        className={twMerge("self-start mt-auto", className)}
      >
        Partially Returned
      </UiTag>
    )
  }

  if (order.fulfillment_status === "canceled") {
    return (
      <UiTag
        iconName="close"
        isActive
        className={twMerge("self-start mt-auto", className)}
      >
        Canceled
      </UiTag>
    )
  }

  if (order.fulfillment_status === "delivered") {
    return (
      <UiTag
        iconName="check"
        isActive
        className={twMerge("self-start mt-auto", className)}
      >
        Delivered
      </UiTag>
    )
  }

  if (
    order.fulfillment_status === "shipped" ||
    order.fulfillment_status === "partially_delivered"
  ) {
    return (
      <UiTag
        iconName="truck"
        isActive
        className={twMerge("self-start mt-auto", className)}
      >
        Delivering
      </UiTag>
    )
  }

  return (
    <UiTag
      iconName="package"
      isActive
      className={twMerge("self-start mt-auto", className)}
    >
      Packing
    </UiTag>
  )
}
