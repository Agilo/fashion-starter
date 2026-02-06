"use client"

import * as React from "react"
import { UiTag } from "@/components/ui/Tag"
import { UiTagList, UiTagListDivider } from "@/components/ui/TagList"

export type ReturnStatus =
  | "requested"
  | "approved"
  | "shipped"
  | "received"
  | "refunded"
  | "rejected"

type ReturnStatusTrackerProps = {
  status: ReturnStatus
  className?: string
}

export const ReturnStatusTracker: React.FC<ReturnStatusTrackerProps> = ({
  status,
  className,
}) => {
  const statusOrder: ReturnStatus[] = [
    "requested",
    "approved",
    "shipped",
    "received",
    "refunded",
  ]
  const currentIndex = statusOrder.indexOf(status)

  if (status === "rejected") {
    return (
      <div className={className}>
        <UiTag iconName="close" isActive className="bg-red-600">
          Return Rejected
        </UiTag>
      </div>
    )
  }

  return (
    <UiTagList className={className}>
      <UiTag isActive={currentIndex >= 0} iconName="receipt">
        Requested
      </UiTag>
      <UiTagListDivider />
      <UiTag isActive={currentIndex >= 1} iconName="check">
        Approved
      </UiTag>
      <UiTagListDivider />
      <UiTag isActive={currentIndex >= 2} iconName="truck">
        Shipped
      </UiTag>
      <UiTagListDivider />
      <UiTag isActive={currentIndex >= 3} iconName="package">
        Received
      </UiTag>
      <UiTagListDivider />
      <UiTag isActive={currentIndex >= 4} iconName="credit-card">
        Refunded
      </UiTag>
    </UiTagList>
  )
}
