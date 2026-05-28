"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"

import { convertToLocale } from "@lib/util/money"

type CartTotalsProps = {
  cart: HttpTypes.StoreCart
}

const CartTotals: React.FC<CartTotalsProps> = ({ cart }) => {
  const {
    currency_code,
    total,
    item_subtotal,
    tax_total,
    discount_total,
    shipping_total,
    gift_card_total,
  } = cart

  return (
    <div>
      <div className="flex flex-col gap-2 lg:gap-1 mb-8">
        <div className="flex justify-between max-lg:text-xs">
          <div>
            <p>Subtotal</p>
          </div>
          <div className="self-end">
            <p>
              {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
            </p>
          </div>
        </div>
        {!!discount_total && (
          <div className="flex justify-between max-lg:text-xs">
            <div>
              <p>Discount</p>
            </div>
            <div className="self-end">
              <p>
                -{" "}
                {convertToLocale({
                  amount: discount_total ?? 0,
                  currency_code,
                })}
              </p>
            </div>
          </div>
        )}
        <div className="flex justify-between max-lg:text-xs">
          <div>
            <p>Shipping</p>
          </div>
          <div className="self-end">
            <p>
              {convertToLocale({ amount: shipping_total ?? 0, currency_code })}
            </p>
          </div>
        </div>
        <div className="flex justify-between max-lg:text-xs">
          <div>
            <p>Taxes</p>
          </div>
          <div className="self-end">
            <p>{convertToLocale({ amount: tax_total ?? 0, currency_code })}</p>
          </div>
        </div>
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
      <div className="absolute h-full w-auto top-0 right-0 bg-black" />
    </div>
  )
}

export default CartTotals
