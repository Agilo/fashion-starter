"use client"

import React, { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import {
  UiRadioGroup,
  UiRadio,
  UiRadioBox,
  UiRadioLabel,
} from "@/components/ui/Radio"
import Loader from "@medusajs/icons/dist/components/loader"

type ReturnShippingSelectorProps = {
  shippingOptions: HttpTypes.StoreCartShippingOption[]
  selectedOption: string
  onOptionSelect: (optionId: string) => void
  cartId: string
  currencyCode: string
}

const ReturnShippingSelector: React.FC<ReturnShippingSelectorProps> = ({
  shippingOptions,
  selectedOption,
  onOptionSelect,
  cartId,
  currencyCode,
}) => {
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})

  useEffect(() => {
    setIsLoadingPrices(true)

    if (shippingOptions?.length) {
      const promises = shippingOptions
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cartId))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => {
              const value = (
                p as PromiseFulfilledResult<{
                  id: string
                  amount: number
                } | null>
              ).value
              if (value?.id && value?.amount !== undefined) {
                pricesMap[value.id] = value.amount
              }
            })

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      } else {
        setIsLoadingPrices(false)
      }
    } else {
      setIsLoadingPrices(false)
    }
  }, [shippingOptions, cartId])

  if (shippingOptions.length === 0) {
    return (
      <p className="text-gray-600">
        No return shipping options are currently available. Please contact
        customer service for assistance.
      </p>
    )
  }

  return (
    <div className="relative">
      <UiRadioGroup
        value={selectedOption}
        onChange={onOptionSelect}
        className="flex flex-col gap-3"
      >
        {shippingOptions.map((option) => (
          <UiRadio key={option.id} value={option.id} variant="outline">
            <UiRadioBox />
            <div className="flex-1 flex items-center gap-3">
              <div className="flex flex-col">
                <UiRadioLabel className="font-medium">
                  {option.name}
                </UiRadioLabel>
                {option.data &&
                  typeof option.data === "object" &&
                  option.data !== null &&
                  "description" in option.data && (
                    <span className="text-xs text-grayscale-500">
                      {String(option.data.description)}
                    </span>
                  )}
              </div>
            </div>
            <span className="text-sm font-medium text-grayscale-900">
              {option.price_type === "flat" ? (
                convertToLocale({
                  amount: option.amount!,
                  currency_code: currencyCode,
                })
              ) : calculatedPricesMap[option.id] ? (
                convertToLocale({
                  amount: calculatedPricesMap[option.id],
                  currency_code: currencyCode,
                })
              ) : isLoadingPrices ? (
                <Loader />
              ) : (
                "-"
              )}
            </span>
          </UiRadio>
        ))}
      </UiRadioGroup>
    </div>
  )
}

export default ReturnShippingSelector
