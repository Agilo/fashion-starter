// Fields shared by cart and order line items. is_tax_inclusive on
// adjustments is on Medusa's model but missing from its HTTP types.
type PricedLineItem = {
  unit_price: number
  quantity: number
  is_tax_inclusive?: boolean
  tax_lines?: { rate: number }[] | null
  adjustments?: { amount: number; is_tax_inclusive?: boolean }[] | null
}

const getTaxRate = (item: PricedLineItem): number =>
  (item.tax_lines ?? []).reduce((sum, line) => sum + line.rate, 0) / 100

export const getDiscountPerUnit = (item: PricedLineItem): number => {
  const taxRate = getTaxRate(item)
  const discount = (item.adjustments ?? []).reduce(
    (sum, adjustment) =>
      sum +
      (adjustment.is_tax_inclusive
        ? adjustment.amount / (1 + taxRate)
        : adjustment.amount),
    0
  )

  return item.quantity ? discount / item.quantity : 0
}

// The per-unit discount in the same tax mode as the item's unit_price.
export const getDisplayDiscountPerUnit = (item: PricedLineItem): number =>
  item.is_tax_inclusive
    ? getDiscountPerUnit(item) * (1 + getTaxRate(item))
    : getDiscountPerUnit(item)

export const getUnitPriceWithTax = (item: PricedLineItem): number =>
  item.is_tax_inclusive
    ? item.unit_price
    : item.unit_price * (1 + getTaxRate(item))

export const getRefundPerUnit = (item: PricedLineItem): number =>
  getUnitPriceWithTax(item) - getDiscountPerUnit(item) * (1 + getTaxRate(item))
