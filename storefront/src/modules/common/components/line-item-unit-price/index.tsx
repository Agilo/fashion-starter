import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { twMerge } from "tailwind-merge"

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
  className?: string
  regularPriceClassName?: string
}

const LineItemUnitPrice = ({
  item,
  currencyCode,
  className,
  regularPriceClassName,
}: LineItemUnitPriceProps) => {
  const hasDiscount =
    "discount_total" in item &&
    (item as HttpTypes.StoreOrderLineItem).discount_total > 0

  const effectiveUnitPrice = hasDiscount
    ? (item as HttpTypes.StoreOrderLineItem).refundable_total_per_unit
    : item.unit_price

  return (
    <div className={className}>
      {hasDiscount ? (
        <>
          <p className="text-base sm:text-sm font-semibold text-red-primary">
            {convertToLocale({
              amount: effectiveUnitPrice,
              currency_code: currencyCode,
            })}
          </p>
          <p className="text-grayscale-500 line-through">
            {convertToLocale({
              amount: item.unit_price,
              currency_code: currencyCode,
            })}
          </p>
        </>
      ) : (
        <p
          className={twMerge(
            "text-xs sm:text-sm font-semibold",
            regularPriceClassName
          )}
        >
          {convertToLocale({
            amount: item.unit_price,
            currency_code: currencyCode,
          })}
        </p>
      )}
    </div>
  )
}

export default LineItemUnitPrice
