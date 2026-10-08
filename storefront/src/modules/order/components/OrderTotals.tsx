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

  // Until a payment is captured nothing has been paid or refunded, so the
  // regular totals (which already reflect returned items) are shown instead.
  if (summary && (summary.paid_total ?? 0) > 0 && hasReturnedItems(order)) {
    const paidTotal = summary.paid_total ?? 0
    const refundedTotal = summary.refunded_total ?? 0
    // A negative pending difference is money Medusa still owes the customer.
    const pendingRefund = Math.max(0, -(summary.pending_difference ?? 0))

    return (
      <div className="sm:max-w-65 w-full flex-1">
        <TotalsRow
          label="Total paid"
          amount={paidTotal}
          currencyCode={currency_code}
        />
        <TotalsRow
          label="Refunded"
          amount={refundedTotal}
          currencyCode={currency_code}
          negative
        />
        {pendingRefund > 0 && (
          <TotalsRow
            label="Refund pending"
            amount={pendingRefund}
            currencyCode={currency_code}
            negative
          />
        )}
        <TotalRow
          label="Net paid"
          amount={paidTotal - refundedTotal}
          currencyCode={currency_code}
        />
      </div>
    )
  }

  const {
    item_subtotal,
    original_item_total,
    discount_total,
    discount_tax_total,
    shipping_subtotal,
    original_shipping_total,
    gift_card_total,
    tax_total,
    total,
  } = order
  // Show the rows in the same tax mode as the item prices.
  const isTaxInclusive =
    !!order.items?.length && order.items.every((item) => item.is_tax_inclusive)
  const discount = isTaxInclusive
    ? (discount_total ?? 0)
    : (discount_total ?? 0) - (discount_tax_total ?? 0)

  return (
    <div className="sm:max-w-65 w-full flex-1">
      <TotalsRow
        label="Subtotal"
        amount={(isTaxInclusive ? original_item_total : item_subtotal) ?? 0}
        currencyCode={currency_code}
      />
      {!!discount && (
        <TotalsRow
          label="Discount"
          amount={discount}
          currencyCode={currency_code}
          negative
        />
      )}
      <TotalsRow
        label="Shipping"
        amount={
          (isTaxInclusive ? original_shipping_total : shipping_subtotal) ?? 0
        }
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
      {!isTaxInclusive && (
        <TotalsRow
          label="Tax"
          amount={tax_total ?? 0}
          currencyCode={currency_code}
        />
      )}
      <TotalRow
        label="Total"
        amount={total ?? 0}
        currencyCode={currency_code}
      />
      {isTaxInclusive && (
        <p className="text-xs text-grayscale-500">
          Including {convertToLocale({ amount: tax_total ?? 0, currency_code })}{" "}
          tax
        </p>
      )}
    </div>
  )
}
