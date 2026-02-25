import * as React from "react"
import Image from "next/image"
import { LocalizedLink } from "@/components/LocalizedLink"
import { convertToLocale } from "@lib/util/money"
import { StoreOrderLineItem } from "@medusajs/types/dist/http/order/store/entities"

type OrderItemProps = {
  item: StoreOrderLineItem
  currencyCode: string
  className?: string
}

export const OrderItem: React.FC<OrderItemProps> = ({
  item,
  currencyCode,
  className,
}) => {
  const {
    thumbnail,
    product_handle,
    product_title,
    title,
    quantity,
    variant,
    discount_total,
    original_total,
    total,
  } = item

  return (
    <div className={className}>
      {thumbnail && (
        <LocalizedLink
          href={`/products/${product_handle}`}
          className="max-w-25 sm:max-w-37 shrink-0 aspect-[3/4] w-full relative overflow-hidden"
        >
          <Image src={thumbnail} alt={title} fill className="object-cover" />
        </LocalizedLink>
      )}
      <div className="flex flex-col flex-1">
        <p className="mb-2 sm:text-md">
          <LocalizedLink href={`/products/${product_handle}`}>
            {product_title}
          </LocalizedLink>
        </p>
        <div className="text-xs flex flex-col flex-1">
          <div>
            {variant?.options?.map((option) => (
              <p className="mb-1" key={option.id}>
                <span className="text-grayscale-500 mr-2">
                  {option.option?.title}:
                </span>
                {option.value}
              </p>
            ))}
          </div>
          <div className="mt-auto flex max-xs:flex-col md:max-lg:flex-col gap-x-10 gap-y-6.5 xs:max-md:items-center md:max-lg:h-full lg:items-center justify-between relative">
            <div className="xs:max-md:self-end lg:self-end sm:mb-1">
              <p>
                <span className="text-grayscale-500 mr-2">Quantity:</span>
                {quantity}
              </p>
            </div>
            <div>
              <div className="line-through text-grayscale-400 sm:text-sm">
                {!!discount_total && (
                  <p>
                    {convertToLocale({
                      currency_code: currencyCode,
                      amount: original_total,
                    })}
                  </p>
                )}
              </div>
              <p className="sm:text-md">
                {convertToLocale({
                  currency_code: currencyCode,
                  amount: total,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
