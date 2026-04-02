import * as React from "react"
import { twMerge } from "tailwind-merge"
import { convertToLocale } from "@lib/util/money"

type ReturnSummaryProps = {
  itemsCount: number
  totalReturnValue: number
  currencyCode: string
  className?: string
}

export const ReturnSummary: React.FC<ReturnSummaryProps> = ({
  itemsCount,
  totalReturnValue,
  currencyCode,
  className,
}) => {
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
      </div>

      <div className="border-t border-grayscale-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total Refund</span>
          <span className="text-lg font-semibold">
            {convertToLocale({
              currency_code: currencyCode,
              amount: totalReturnValue,
            })}
          </span>
        </div>
      </div>

      <div className="border-t border-grayscale-200 pt-4">
        <p className="text-xs text-grayscale-500">
          Estimated refund time: 5-10 business days after we receive your return
        </p>
      </div>
    </div>
  )
}
