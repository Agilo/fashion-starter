import * as React from "react"
import { UiTag } from "@/components/ui/Tag"
import { UiTagList, UiTagListDivider } from "@/components/ui/TagList"
import { HttpTypes } from "@medusajs/types"

type OrderStatusProps = {
  order: HttpTypes.StoreOrder
  className?: string
}

export const OrderStatus: React.FC<OrderStatusProps> = ({
  order,
  className,
}) => {
  if (order.status === "canceled") {
    return (
      <UiTag iconName="close" isActive className={className}>
        Canceled
      </UiTag>
    )
  }

  if (order.fulfillment_status === "delivered") {
    return (
      <UiTagList className={className}>
        <UiTag isActive iconName="package">
          Packing
        </UiTag>
        <UiTagListDivider />
        <UiTag isActive iconName="truck">
          Delivering
        </UiTag>
        <UiTagListDivider />
        <UiTag isActive iconName="check">
          Delivered
        </UiTag>
      </UiTagList>
    )
  }

  if (
    order.fulfillment_status === "shipped" ||
    order.fulfillment_status === "partially_delivered"
  ) {
    return (
      <UiTagList className={className}>
        <UiTag isActive iconName="package">
          Packing
        </UiTag>
        <UiTagListDivider />
        <UiTag isActive iconName="truck">
          Delivering
        </UiTag>
        <UiTagListDivider />
        <UiTag iconName="check">Delivered</UiTag>
      </UiTagList>
    )
  }

  return (
    <UiTagList className={className}>
      <UiTag isActive iconName="package">
        Packing
      </UiTag>
      <UiTagListDivider />
      <UiTag iconName="truck">Delivering</UiTag>
      <UiTagListDivider />
      <UiTag iconName="check">Delivered</UiTag>
    </UiTagList>
  )
}
