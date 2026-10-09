import { convertToLocale } from "@lib/util/money"
import { getDiscountsByCode, getTotalsBreakdown } from "@lib/util/totals"
import { HttpTypes } from "@medusajs/types"

const TotalsRow: React.FC<{
  label: string
  amount: number
  currencyCode: string
  negative?: boolean
  amountClassName?: string
}> = ({ label, amount, currencyCode, negative, amountClassName }) => (
  <div className="flex justify-between gap-4 mb-2">
    <div className="text-grayscale-500">
      <p>{label}</p>
    </div>
    <div className="self-end">
      <p className={amountClassName}>
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

  const { gift_card_total, tax_total, total } = order
  const { isTaxInclusive, subtotal, discount, shipping } =
    getTotalsBreakdown(order)
  const discountsByCode = getDiscountsByCode(order, isTaxInclusive)

  return (
    <div className="sm:max-w-65 w-full flex-1">
      <TotalsRow
        label="Subtotal"
        amount={subtotal}
        currencyCode={currency_code}
      />
      {!!discount && (
        <>
          <TotalsRow
            label="Discount"
            amount={discount}
            currencyCode={currency_code}
            negative
            amountClassName="text-red-900"
          />
          {Object.entries(discountsByCode).map(([code, amount]) => (
            <div
              key={code}
              className="flex justify-between gap-4 -mt-1 mb-2 pl-3 text-xs text-grayscale-500"
            >
              <p>{code}</p>
              <p>- {convertToLocale({ amount, currency_code })}</p>
            </div>
          ))}
        </>
      )}
      <TotalsRow
        label="Shipping"
        amount={shipping}
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
