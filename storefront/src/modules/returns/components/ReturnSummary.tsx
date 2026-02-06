"use client"

import * as React from "react"
import { twMerge } from "tailwind-merge"
import { convertToLocale } from "@lib/util/money"
import { RefundMethod } from "./RefundMethodSelect"

type ReturnSummaryProps = {
  itemsCount: number
  totalReturnValue: number
  currencyCode: string
  refundMethod: RefundMethod
  storeCreditBonus?: number
  shippingRefund?: number
  className?: string
}

export const ReturnSummary: React.FC<ReturnSummaryProps> = ({
  itemsCount,
  totalReturnValue,
  currencyCode,
  refundMethod,
  storeCreditBonus = 10,
  shippingRefund = 0,
  className,
}) => {
  const bonusAmount =
    refundMethod === "store_credit"
      ? (totalReturnValue * storeCreditBonus) / 100
      : 0
  const totalRefund = totalReturnValue + bonusAmount + shippingRefund

  return (
    <div
      className={twMerge(
        "bg-grayscale-50 rounded-xs p-6 flex flex-col gap-4",
        className
      )}
    >
      <h3 className="font-semibold text-md">Return Summary</h3>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-grayscale-500">
            Items to return ({itemsCount})
          </span>
          <span>
            {convertToLocale({
              currency_code: currencyCode,
              amount: totalReturnValue,
            })}
          </span>
        </div>

        {shippingRefund > 0 && (
          <div className="flex justify-between">
            <span className="text-grayscale-500">Shipping refund</span>
            <span>
              {convertToLocale({
                currency_code: currencyCode,
                amount: shippingRefund,
              })}
            </span>
          </div>
        )}

        {bonusAmount > 0 && (
          <div className="flex justify-between text-green-700">
            <span>Store credit bonus (+{storeCreditBonus}%)</span>
            <span>
              +
              {convertToLocale({
                currency_code: currencyCode,
                amount: bonusAmount,
              })}
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-grayscale-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total Refund</span>
          <span className="text-lg font-semibold">
            {convertToLocale({
              currency_code: currencyCode,
              amount: totalRefund,
            })}
          </span>
        </div>
        <p className="text-xs text-grayscale-500 mt-1">
          {refundMethod === "store_credit"
            ? "As store credit"
            : "To original payment method"}
        </p>
      </div>

      <div className="border-t border-grayscale-200 pt-4">
        <p className="text-xs text-grayscale-500">
          Estimated refund time: 5-10 business days after we receive your return
        </p>
      </div>
    </div>
  )
}
