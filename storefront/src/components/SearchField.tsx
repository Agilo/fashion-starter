"use client"

import * as React from "react"
import * as ReactAria from "react-aria-components"
import { twJoin } from "tailwind-merge"
import { useAsyncList } from "react-stately"
import { useRouter, useSearchParams } from "next/navigation"
import { useCountryCode } from "hooks/country-code"
import { searchProducts } from "@lib/data/search"
import { getProductPrice } from "@lib/util/get-product-price"
import { getProductsById } from "@lib/data/products"
import Thumbnail from "@modules/products/components/thumbnail"
import { Button } from "@/components/Button"
import { Input } from "@/components/Forms"
import { Icon } from "@/components/Icon"

interface ListItem {
  id: string
  handle: string
  title: string
  thumbnail: string
  variants: string[]
  price: {
    calculated_price_number: number
    calculated_price: string
    original_price_number: number | null
    original_price: string
    currency_code: string | null
    price_type: string | null | undefined
    percentage_diff: string
  } | null
}

export const SearchField: React.FC<{
  countryOptions: {
    country: string | undefined
    region: string
    label: string | undefined
  }[]
  isInputAlwaysShown?: boolean
}> = ({ countryOptions, isInputAlwaysShown }) => {
  const router = useRouter()
  const [isInputShown, setIsInputShown] = React.useState(false)
  const countryCode = useCountryCode()
  const region = countryOptions.find((co) => co.country === countryCode)?.region
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query")

  const list = useAsyncList<ListItem>({
    getKey(item) {
      return item.handle
    },
    load: async ({ filterText, signal }) => {
      const results = await searchProducts(filterText ?? "", 10, signal)
      if (signal.aborted) return { items: [], filterText }
      const medusaProducts = await getProductsById({
        ids: results.hits.map((hit) => hit.id),
        regionId: region!,
      })

      return {
        items: results.hits.flatMap((hit) => {
          const product = medusaProducts.find((candidate) => candidate.id === hit.id)
          if (!product) return []
          return {
            id: hit.id,
            handle: product.handle,
            title: product.title,
            thumbnail: product.thumbnail ?? "",
            variants: product.variants?.map((variant) => variant.title ?? "") ?? [],
            price: getProductPrice({
              product,
            }).cheapestPrice,
          }
        }),
        filterText,
      }
    },
    initialFilterText: searchQuery ?? "",
  })

  const buttonPressHandle = React.useCallback(() => {
    if (!isInputShown) {
      setIsInputShown(true)
    } else if (list.filterText) {
      router.push(`/${countryCode}/search?query=${list.filterText}`)
      if (!isInputAlwaysShown) setIsInputShown(false)
    } else {
      if (!isInputAlwaysShown) setIsInputShown(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInputShown, list.filterText, router, countryCode])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!isInputAlwaysShown) setIsInputShown(false)
      } else if (e.key === "Enter" && list.filterText) {
        router.push(`/${countryCode}/search?query=${list.filterText}`)
        if (!isInputAlwaysShown) setIsInputShown(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list.filterText, router, countryCode]
  )

  React.useEffect(() => {
    if (searchQuery && !list.filterText) {
      list.setFilterText(searchQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  React.useEffect(() => {
    if (isInputAlwaysShown) setIsInputShown(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex">
      <Button
        onPress={buttonPressHandle}
        variant="ghost"
        className="p-1 max-md:text-white group-data-[light=true]:md:text-white group-data-[sticky=true]:md:text-black"
        aria-label="Open search"
      >
        <Icon name="search" className="w-5 h-5" />
      </Button>
      <ReactAria.ComboBox
        allowsCustomValue
        className="overflow-hidden"
        aria-label="Search"
        items={list.items}
        inputValue={list.filterText}
        onInputChange={list.setFilterText}
        onKeyDown={handleKeyDown}
        isDisabled={!isInputAlwaysShown && !isInputShown}
      >
        <div
          className={twJoin(
            "overflow-hidden transition-width duration-500 h-full max-w-40 md:max-w-30",
            isInputShown ? "w-full md:w-30" : "md:w-0"
          )}
        >
          <Input className="px-0 disabled:bg-transparent !py-0 h-7 md:h-6 max-md:border-0 border-black rounded-none border-t-0 border-x-0 group-data-[light=true]:md:border-white group-data-[sticky=true]:md:border-black ml-2 md:ml-1" />
        </div>
        <ReactAria.Popover
          placement="bottom end"
          containerPadding={10}
          maxHeight={243}
          offset={25}
          className="max-w-90 md:max-w-95 lg:max-w-98 w-full bg-white rounded-xs border border-grayscale-200 overflow-y-scroll"
        >
          <ReactAria.ListBox className="outline-none">
            {(item: ListItem) => (
              <ReactAria.ListBoxItem
                className="relative after:absolute after:content-[''] after:h-px after:bg-grayscale-100 after:-bottom-px after:left-6 after:right-6 last:after:hidden mb-px flex gap-6 p-6 transition-colors hover:bg-grayscale-50"
                key={item.handle}
                id={item.handle}
                href={`/${countryCode}/products/${item.handle}`}
              >
                <Thumbnail
                  thumbnail={item.thumbnail}
                  size="3/4"
                  className="w-20"
                />
                <div>
                  <p className="text-base font-normal">{item.title}</p>
                  <p className="text-grayscale-500 text-xs">
                    {item.variants[0]}
                  </p>
                </div>
                <p className="text-base font-semibold ml-auto">
                  {item.price?.calculated_price}
                </p>
              </ReactAria.ListBoxItem>
            )}
          </ReactAria.ListBox>
        </ReactAria.Popover>
      </ReactAria.ComboBox>
    </div>
  )
}
