"use client"

import * as React from "react"
import { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"
import CartTotals from "@modules/cart/components/cart-totals"
import { LocalizedButtonLink, LocalizedLink } from "@/components/LocalizedLink"
import { Drawer } from "@/components/Drawer"
import { Button } from "@/components/Button"
import DiscountCode from "@modules/cart/components/discount-code"
import { Icon } from "@/components/Icon"
import { getCheckoutStep } from "@modules/cart/utils/getCheckoutStep"
import { useCart, useCartQuantity } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"

export const CartDrawer = withReactQueryProvider(() => {
  const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false)

  const { data: cart, isPending } = useCart({ enabled: isCartDrawerOpen })

  const step = getCheckoutStep(cart as HttpTypes.StoreCart)

  const { data: quantity, isPending: pendingQuantity } = useCartQuantity()

  return (
    <>
      <Button
        onPress={() => setIsCartDrawerOpen(true)}
        variant="ghost"
        className="p-1 group-data-[light=true]:md:text-white group-data-[sticky=true]:md:text-black"
        aria-label="Open cart"
      >
        {pendingQuantity ? (
          <Icon name="case" className=" w-6 h-6" />
        ) : (
          <Icon
            name="case"
            className=" w-6 h-6"
            status={quantity && quantity > 0 ? quantity : undefined}
          />
        )}
      </Button>
      <Drawer
        colorScheme="light"
        animateFrom="right"
        isOpen={isCartDrawerOpen}
        onOpenChange={setIsCartDrawerOpen}
        className="max-sm:max-w-100 max-w-139 max-sm:px-6 px-12 pt-10"
      >
        {({ close }) => (
          <>
            <div className="flex justify-between mb-2">
              <div>
                <p className="text-md">Cart</p>
              </div>
              <button onClick={close} aria-label="Close cart">
                <Icon name="close" className="w-6" />
              </button>
            </div>
            {cart?.items?.length ? (
              <>
                <div className="pb-8 pr-3 sm:pr-4 overflow-y-scroll">
                  {cart?.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => {
                      return (
                        <Item
                          key={item.id}
                          item={item}
                          currencyCode={cart.currency_code}
                          className="py-8 last:pb-0 last:border-b-0"
                        />
                      )
                    })}
                </div>
                <div className="sticky left-0 bg-white bottom-0 pt-4 border-t border-grayscale-200 mt-auto">
                  <CartTotals isPartOfCartDrawer cart={cart} />
                  <DiscountCode cart={cart} className="mt-6" />
                  <LocalizedButtonLink
                    href={`/checkout/?step=${step}`}
                    isFullWidth
                    className="mt-4"
                  >
                    Proceed to checkout
                  </LocalizedButtonLink>
                </div>
              </>
            ) : isPending ? (
              <div className="flex align-middle justify-around items-center h-screen ">
                <Icon name="loader" className="w-10 md:w-15 animate-spin" />
              </div>
            ) : (
              <>
                <p className="md:text-sm max-sm:mr-10 mb-6 mt-2">
                  You don&apos;t have anything in your cart. Let&apos;s change
                  that, use the link below to start browsing our products.
                </p>
                <div>
                  <LocalizedLink
                    href="/store"
                    onClick={() => {
                      setIsCartDrawerOpen(false)
                    }}
                  >
                    Explore products
                  </LocalizedLink>
                </div>
              </>
            )}
          </>
        )}
      </Drawer>
    </>
  )
})
