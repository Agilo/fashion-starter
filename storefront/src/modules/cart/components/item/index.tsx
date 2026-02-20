"use client"
import { HttpTypes } from "@medusajs/types"
import { getVariantItemsInStock } from "@lib/util/inventory"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"
import { InputNumberField } from "@/components/InputNumberField"
import { LocalizedLink } from "@/components/LocalizedLink"
import { twMerge } from "tailwind-merge"
import { useLineItemQuantityUpdater } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  className?: string
}

const Item = ({ item, className }: ItemProps) => {
  const { handle } = item.variant?.product ?? {}
  const {
    quantity,
    error,
    onQuantityChange,
    onQuantityCommit,
    onQuantityFocus,
    onQuantityBlur,
  } = useLineItemQuantityUpdater({
    lineId: item.id,
    initialQuantity: item.quantity,
  })
  const maxQuantity = item.variant ? getVariantItemsInStock(item.variant) : 0

  return (
    <div
      className={twMerge(
        "border-b border-grayscale-100 py-8 lg:last:pb-0 lg:last:border-b-0",
        className
      )}
    >
      <div className="flex gap-6">
        <LocalizedLink href={`/products/${handle}`}>
          <Thumbnail
            thumbnail={item.variant?.product?.thumbnail}
            images={item.variant?.product?.images}
            size="3/4"
            className="w-25 sm:w-30"
          />
        </LocalizedLink>
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <h2 className="sm:text-md text-base font-normal">
              <LocalizedLink href={`/products/${handle}`}>
                {item.product_title}
              </LocalizedLink>
            </h2>
            <p className="text-grayscale-500 text-xs sm:text-base max-sm:mb-4">
              {item.variant?.title}
            </p>
            <LineItemUnitPrice item={item} className="sm:hidden" />
          </div>
          <InputNumberField
            key={item.id}
            size="sm"
            minValue={1}
            maxValue={maxQuantity}
            value={quantity}
            onChange={onQuantityChange}
            onCommit={onQuantityCommit}
            onFocus={onQuantityFocus}
            onBlur={onQuantityBlur}
            className="w-25"
            aria-label="Quantity"
          />
        </div>
        <div className="flex flex-col justify-between items-end text-right">
          <LineItemUnitPrice item={item} className="max-sm:hidden" />
          <DeleteButton id={item.id} data-testid="product-delete-button" />
        </div>
      </div>
      <ErrorMessage
        error={error?.message}
        data-testid="product-error-message"
      />
    </div>
  )
}

export default withReactQueryProvider(Item)
