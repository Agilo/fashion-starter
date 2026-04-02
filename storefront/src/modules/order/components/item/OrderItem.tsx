import * as React from "react"
import Image from "next/image"
import { LocalizedLink } from "@/components/LocalizedLink"
import { convertToLocale } from "@lib/util/money"
import { twJoin } from "tailwind-merge"
import { StoreProductVariant } from "@medusajs/types"

type OrderItemProps = {
  thumbnail: string
  product_handle: string
  product_title: string
  title: string
  variant?: StoreProductVariant
  quantity: number
  fulfilled_total: number
  unit_price: number
  currencyCode: string
  className?: string
}

export const OrderItem: React.FC<OrderItemProps> = ({
  thumbnail,
  product_handle,
  product_title,
  title,
  variant,
  quantity,
  fulfilled_total,
  unit_price,
  currencyCode,
  className,
}) => {
  const discountedUnitPrice = quantity > 0 ? fulfilled_total / quantity : 0
  const hasDiscount = quantity > 0 && discountedUnitPrice < unit_price

  return (
    <div className={className}>
      {thumbnail && (
        <LocalizedLink
          href={`/products/${product_handle}`}
          className="max-w-25 sm:max-w-37 shrink-0 aspect-[3/4] w-full relative overflow-hidden"
        >
          <Image
            src={thumbnail}
            alt={title || "Product image"}
            fill
            className="object-cover"
          />
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
              <p
                className={twJoin(
                  "sm:text-md",
                  hasDiscount && "text-red-primary font-semibold"
                )}
              >
                {convertToLocale({
                  currency_code: currencyCode,
                  amount: discountedUnitPrice,
                })}
              </p>
              {hasDiscount && (
                <div className="line-through text-grayscale-400 sm:text-sm">
                  <p>
                    {convertToLocale({
                      currency_code: currencyCode,
                      amount: unit_price,
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
