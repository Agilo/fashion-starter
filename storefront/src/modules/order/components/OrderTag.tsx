import { UiTag } from "@/components/ui/Tag"
import { twMerge } from "tailwind-merge"
import { getReturnCoverage, OrderWithReturns } from "@lib/util/returns"

export const OrderStatusTag: React.FC<{
  order: OrderWithReturns
  className?: string
}> = ({ order, className }) => {
  const { hasAnyReturnedItem, areAllItemsReturned } = getReturnCoverage(order)
  const hasActiveReturn = order.returns?.some(
    (r) => r.status && r.status !== "canceled"
  )

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

  if (order.fulfillment_status === "delivered" && hasActiveReturn) {
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

  if (order.status === "canceled") {
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
