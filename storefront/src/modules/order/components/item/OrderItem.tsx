import * as React from "react"
import Image from "next/image"
import { LocalizedLink } from "@/components/LocalizedLink"
import { convertToLocale } from "@lib/util/money"

type OrderItemProps = {
  id: string
  thumbnail: string | null
  product_handle: string | null
  product_title: string | null
  title: string
  quantity: number
  currencyCode: string
  amount: number
  variant?: {
    options?: Array<{
      id: string
      option?: { title?: string } | null
      value: string
    }> | null
  }
  className?: string
}

export const OrderItem: React.FC<OrderItemProps> = ({
  thumbnail,
  product_handle,
  product_title,
  title,
  quantity,
  currencyCode,
  amount,
  variant,
  className,
}) => {
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
            <div className="sm:text-md">
              <p>
                {convertToLocale({
                  currency_code: currencyCode,
                  amount: amount,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
