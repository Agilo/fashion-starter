import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

export const OrderTotals: React.FC<{
  order: HttpTypes.StoreOrder
}> = ({ order }) => {
  const { currency_code, tax_total, shipping_total, gift_card_total } = order

  const itemSubtotal =
    order.items?.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    ) ?? 0

  const itemDiscounted =
    //@ts-expect-error - to be removed when fulfilled_total is added to the type
    order.items?.reduce((sum, item) => sum + item.fulfilled_total, 0) ?? 0
  const hasDiscount = itemDiscounted < itemSubtotal
  const itemsDiscount = itemSubtotal - itemDiscounted
  const itemsTotal =
    itemDiscounted + shipping_total + tax_total - (gift_card_total ?? 0)

  return (
    <div className="sm:max-w-65 w-full flex-1">
      <div className="flex justify-between gap-4 mb-2">
        <div className="text-grayscale-500">
          <p>Subtotal</p>
        </div>
        <div className="self-end">
          <p>
            {convertToLocale({
              currency_code,
              amount: itemSubtotal,
            })}
          </p>
        </div>
      </div>
      {hasDiscount && (
        <div className="flex justify-between gap-4 mb-2">
          <div className="text-grayscale-500">
            <p>Discount</p>
          </div>
          <div className="self-end">
            <p>
              -{" "}
              {convertToLocale({
                amount: itemsDiscount,
                currency_code,
              })}
            </p>
          </div>
        </div>
      )}
      <div className="flex justify-between gap-4 mb-2">
        <div className="text-grayscale-500">
          <p>Shipping</p>
        </div>
        <div className="self-end">
          <p>
            {convertToLocale({
              currency_code,
              amount: shipping_total ?? 0,
            })}
          </p>
        </div>
      </div>
      {!!gift_card_total && (
        <div className="flex justify-between gap-4 mb-2">
          <div className="text-grayscale-500">
            <p>Gift card</p>
          </div>
          <div className="self-end">
            <p>
              -{" "}
              {convertToLocale({ amount: gift_card_total ?? 0, currency_code })}
            </p>
          </div>
        </div>
      )}
      <div className="flex justify-between gap-4 text-md mb-1 mt-6">
        <div>
          <p>Total</p>
        </div>
        <div className="self-end">
          <p>
            {convertToLocale({
              currency_code,
              amount: itemsTotal ?? 0,
            })}
          </p>
        </div>
      </div>
      <p className="text-xs text-grayscale-500">
        Including {convertToLocale({ amount: tax_total ?? 0, currency_code })}{" "}
        tax
      </p>
    </div>
  )
}
