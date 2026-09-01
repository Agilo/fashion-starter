import { LocalizedLink } from "@/components/LocalizedLink"
import { HttpTypes } from "@medusajs/types"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"
import { twMerge } from "tailwind-merge"

type ItemProps = {
  item: HttpTypes.StoreOrderLineItem
  currencyCode: string
  className?: string
}

const Item = ({ item, currencyCode, className }: ItemProps) => {
  return (
    <div
      className={twMerge(
        "flex gap-x-6 sm:gap-x-8 gap-y-6 mb-6 pb-6 border-b border-grayscale-100 last:border-0 last:mb-0 last:pb-0",
        className
      )}
    >
      <LocalizedLink href={`/products/${item.product_handle}`}>
        <Thumbnail
          thumbnail={item.variant?.product?.thumbnail}
          images={item.variant?.product?.images}
          size="3/4"
          className="w-27 sm:w-37"
        />
      </LocalizedLink>
      <div className="flex flex-col flex-1">
        <p className="mb-2 sm:text-md">
          <LocalizedLink href={`/products/${item.product_handle}`}>
            {item.product_title}
          </LocalizedLink>
        </p>
        <div className="text-xs flex flex-col flex-1">
          <div>
            {item.variant?.options?.map((option) => (
              <p className="mb-1" key={option.id}>
                <span className="text-grayscale-500 mr-2">
                  {option.option?.title}:
                </span>
                {option.value}
              </p>
            ))}
          </div>
          <div className="sm:mt-auto flex max-sm:flex-col gap-x-10 gap-y-6 max-sm:h-full sm:items-center justify-between relative">
            <div className="sm:self-end sm:mb-1">
              <p>
                <span className="text-grayscale-500 mr-2">Quantity:</span>
                {item.quantity}
              </p>
            </div>
            <LineItemUnitPrice
              item={item}
              currencyCode={currencyCode}
              regularPriceClassName="text-base sm:text-md font-normal"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
