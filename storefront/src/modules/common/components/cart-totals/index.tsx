"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"

import { convertToLocale } from "@lib/util/money"
import { getDiscountsByCode, getTotalsBreakdown } from "@lib/util/totals"

type CartTotalsProps = {
  cart: HttpTypes.StoreCart
}

const CartTotals: React.FC<CartTotalsProps> = ({ cart }) => {
  const { currency_code, total, tax_total, gift_card_total } = cart
  const { isTaxInclusive, subtotal, discount, shipping } =
    getTotalsBreakdown(cart)
  const discountsByCode = getDiscountsByCode(cart, isTaxInclusive)

  return (
    <div>
      <div className="flex flex-col gap-2 lg:gap-1 mb-8">
        <div className="flex justify-between max-lg:text-xs">
          <div>
            <p>Subtotal</p>
          </div>
          <div className="self-end">
            <p>{convertToLocale({ amount: subtotal, currency_code })}</p>
          </div>
        </div>
        {!!discount && (
          <>
            <div className="flex justify-between max-lg:text-xs">
              <div>
                <p>Discount</p>
              </div>
              <div className="self-end">
                <p className="text-red-900">
                  - {convertToLocale({ amount: discount, currency_code })}
                </p>
              </div>
            </div>
            {Object.entries(discountsByCode).map(([code, amount]) => (
              <div
                key={code}
                className="flex justify-between pl-3 text-xs text-grayscale-500"
              >
                <p>{code}</p>
                <p>- {convertToLocale({ amount, currency_code })}</p>
              </div>
            ))}
          </>
        )}
        <div className="flex justify-between max-lg:text-xs">
          <div>
            <p>Shipping</p>
          </div>
          <div className="self-end">
            <p>{convertToLocale({ amount: shipping, currency_code })}</p>
          </div>
        </div>
        {!isTaxInclusive && (
          <div className="flex justify-between max-lg:text-xs">
            <div>
              <p>Taxes</p>
            </div>
            <div className="self-end">
              <p>
                {convertToLocale({ amount: tax_total ?? 0, currency_code })}
              </p>
            </div>
          </div>
        )}
        {!!gift_card_total && (
          <div className="flex justify-between max-lg:text-xs">
            <div>
              <p>Gift card</p>
            </div>
            <div className="self-end">
              <p>
                -{" "}
                {convertToLocale({
                  amount: gift_card_total ?? 0,
                  currency_code,
                })}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between text-md">
        <div>
          <p>Total</p>
        </div>
        <div className="self-end">
          <p>{convertToLocale({ amount: total ?? 0, currency_code })}</p>
        </div>
      </div>
      {isTaxInclusive && (
        <p className="text-xs text-grayscale-500 text-right mt-1">
          Including {convertToLocale({ amount: tax_total ?? 0, currency_code })}{" "}
          tax
        </p>
      )}
      <div className="absolute h-full w-auto top-0 right-0 bg-black" />
    </div>
  )
}

export default CartTotals
