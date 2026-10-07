import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

const TotalsRow: React.FC<{
  label: string
  amount: number
  currencyCode: string
  negative?: boolean
}> = ({ label, amount, currencyCode, negative }) => (
  <div className="flex justify-between gap-4 mb-2">
    <div className="text-grayscale-500">
      <p>{label}</p>
    </div>
    <div className="self-end">
      <p>
        {negative && "- "}
        {convertToLocale({ amount, currency_code: currencyCode })}
      </p>
    </div>
  </div>
)

const TotalRow: React.FC<{
  label: string
  amount: number
  currencyCode: string
}> = ({ label, amount, currencyCode }) => (
  <div className="flex justify-between gap-4 text-md mb-1 mt-6">
    <div>
      <p>{label}</p>
    </div>
    <div className="self-end">
      <p>{convertToLocale({ amount, currency_code: currencyCode })}</p>
    </div>
  </div>
)

const hasReturnedItems = (order: HttpTypes.StoreOrder) =>
  (order.summary?.refunded_total ?? 0) > 0 ||
  (order.items ?? []).some(
    (item) => (item.detail?.return_received_quantity ?? 0) > 0
  )

export const OrderTotals: React.FC<{
  order: HttpTypes.StoreOrder
}> = ({ order }) => {
  const { currency_code, summary } = order

  if (summary && hasReturnedItems(order)) {
    return (
      <div className="sm:max-w-65 w-full flex-1">
        <TotalsRow
          label="Total paid"
          amount={summary.paid_total ?? 0}
          currencyCode={currency_code}
        />
        <TotalsRow
          label="Refunded"
          amount={summary.refunded_total ?? 0}
          currencyCode={currency_code}
          negative
        />
        <TotalRow
          label="Net paid"
          amount={summary.current_order_total ?? 0}
          currencyCode={currency_code}
        />
      </div>
    )
  }

  const {
    item_subtotal,
    discount_total,
    discount_tax_total,
    shipping_subtotal,
    gift_card_total,
    tax_total,
    total,
  } = order
  const discount_subtotal = (discount_total ?? 0) - (discount_tax_total ?? 0)

  return (
    <div className="sm:max-w-65 w-full flex-1">
      <TotalsRow
        label="Subtotal"
        amount={item_subtotal ?? 0}
        currencyCode={currency_code}
      />
      {!!discount_subtotal && (
        <TotalsRow
          label="Discount"
          amount={discount_subtotal}
          currencyCode={currency_code}
          negative
        />
      )}
      <TotalsRow
        label="Shipping"
        amount={shipping_subtotal ?? 0}
        currencyCode={currency_code}
      />
      {!!gift_card_total && (
        <TotalsRow
          label="Gift card"
          amount={gift_card_total}
          currencyCode={currency_code}
          negative
        />
      )}
      <TotalRow
        label="Total"
        amount={total ?? 0}
        currencyCode={currency_code}
      />
      <p className="text-xs text-grayscale-500">
        Including {convertToLocale({ amount: tax_total ?? 0, currency_code })}{" "}
        tax
      </p>
    </div>
  )
}
