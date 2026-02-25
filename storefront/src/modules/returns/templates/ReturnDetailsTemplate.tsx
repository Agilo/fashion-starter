import * as React from "react"
import { Icon } from "@/components/Icon"
import { convertToLocale } from "@lib/util/money"
import { OrderItem } from "@modules/order/components/item/OrderItem"
import { twJoin } from "tailwind-merge"
import { ReturnStatus } from "@modules/returns/components/ReturnStatus"
import { ReturnWithOrderItems } from "@lib/util/returns"

type ReturnDetailsTemplateProps = {
  returnEntity: ReturnWithOrderItems
  isGuest?: boolean
}

export const ReturnDetailsTemplate: React.FC<ReturnDetailsTemplateProps> = ({
  returnEntity,
  isGuest = false,
}) => {
  return (
    <div
      className={twJoin("max-w-4xl mx-auto", isGuest && "py-32 min-h-screen")}
    >
      <h1 className="text-md md:text-lg mb-8 md:mb-13">
        {`Return #${returnEntity.display_id}`}
      </h1>
      <div className="flex flex-col gap-6">
        <div className="rounded-xs border border-grayscale-200 flex flex-wrap justify-between p-4">
          <div className="flex gap-4 items-center">
            <Icon name="calendar" />
            <p className="text-grayscale-500">Return date</p>
          </div>
          <div>
            <p>{new Date(returnEntity.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4">
          <ReturnStatus returnEntity={returnEntity} />
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4 flex flex-col gap-6">
          {returnEntity.items?.map((returnItem) => (
            <OrderItem
              key={returnItem.id}
              id={returnItem.id}
              thumbnail={returnItem?.item?.thumbnail || null}
              product_handle={returnItem.item?.product_handle || null}
              product_title={returnItem.item?.product_title || null}
              title={returnItem.item?.title || ""}
              quantity={returnItem.quantity}
              currencyCode={returnEntity.currency_code}
              amount={returnItem.item?.total || 0}
              variant={returnItem.item?.variant}
              className="flex gap-x-4 sm:gap-x-8 gap-y-6 pb-6 border-b border-grayscale-100 last:border-0 last:pb-0"
            />
          ))}
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4">
          <div className="flex gap-4 items-center mb-4">
            <Icon name="credit-card" className="w-4 h-4" />
            <p className="text-grayscale-500">Refund Details</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="text-grayscale-500">Refund method</p>
              <p>Original Payment Method</p>
            </div>
            <div className="flex justify-between items-center text-md pt-4 border-t border-grayscale-200 mt-2">
              <p>Total Refund</p>
              <p>
                {convertToLocale({
                  currency_code: returnEntity.currency_code,
                  amount: returnEntity.refund_amount || 0,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xs bg-grayscale-50 p-4">
          <div className="flex gap-4 items-center mb-2">
            <Icon name="info" className="w-4 h-4" />
            <h3 className="font-semibold">Need Help?</h3>
          </div>
          <p className="text-sm text-grayscale-600">
            If you have any questions about your return, please contact our
            customer support team at{" "}
            <a
              href="mailto:support@example.com"
              className="underline font-medium"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
