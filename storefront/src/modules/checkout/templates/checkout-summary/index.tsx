import { HttpTypes } from "@medusajs/types"

import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"
import { LocalizedButtonLink, LocalizedLink } from "@/components/LocalizedLink"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const items = cart.items ?? []
  const numOfItems = items.length

  return (
    <>
      <div className="flex justify-between items-center mb-8 lg:mb-16">
        <div>
          <p>
            Order — {numOfItems} item{numOfItems > 1 ? "s" : ""}
          </p>
        </div>
        <LocalizedButtonLink href="/cart" variant="link">
          Edit cart
        </LocalizedButtonLink>
      </div>
      {numOfItems > 0 &&
        items
          .sort((a, b) => {
            return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
          })
          .map((item) => (
            <div key={item.id} className="flex gap-4 lg:gap-6 mb-8">
              <LocalizedLink
                href={`/products/${item.variant?.product?.handle}`}
              >
                <Thumbnail
                  thumbnail={item.variant?.product?.thumbnail}
                  images={item.variant?.product?.images}
                  size="3/4"
                  className="w-25 lg:w-33"
                />
              </LocalizedLink>
              <div className="flex flex-col flex-1 justify-between">
                <div className="flex flex-wrap gap-x-4 gap-y-1 justify-between">
                  <div>
                    <LocalizedLink
                      href={`/products/${item.variant?.product?.handle}`}
                      className="font-semibold"
                    >
                      {item.product_title}
                    </LocalizedLink>
                  </div>
                  <LineItemUnitPrice
                    item={item}
                    currencyCode={cart.currency_code}
                    regularPriceClassName="text-base sm:text-base font-normal"
                  />
                </div>
                <div className="flex flex-col gap-1.5 max-lg:text-xs">
                  {item.variant?.title && (
                    <p>
                      Variant:{" "}
                      <span className="ml-1">{item.variant.title}</span>
                    </p>
                  )}
                  <p>
                    Quantity: <span className="ml-1">{item.quantity}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
      <DiscountCode cart={cart} />
      <CartTotals cart={cart} />
    </>
  )
}

export default CheckoutSummary
