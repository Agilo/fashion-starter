import { getDisplayDiscountPerUnit } from "@lib/util/line-item-price"
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
  const discountPerUnit = getDisplayDiscountPerUnit(item)
  const hasDiscount = discountPerUnit > 0
  const effectiveUnitPrice = item.unit_price - discountPerUnit

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
