type TotalsSource = {
  item_subtotal?: number | null
  original_item_total?: number | null
  discount_total?: number | null
  discount_tax_total?: number | null
  shipping_subtotal?: number | null
  original_shipping_total?: number | null
  items?: { is_tax_inclusive?: boolean }[] | null
}

export const getTotalsBreakdown = (source: TotalsSource) => {
  const isTaxInclusive =
    !!source.items?.length &&
    source.items.every((item) => item.is_tax_inclusive)

  return {
    isTaxInclusive,
    subtotal:
      (isTaxInclusive ? source.original_item_total : source.item_subtotal) ?? 0,
    discount: isTaxInclusive
      ? (source.discount_total ?? 0)
      : (source.discount_total ?? 0) - (source.discount_tax_total ?? 0),
    shipping:
      (isTaxInclusive
        ? source.original_shipping_total
        : source.shipping_subtotal) ?? 0,
  }
}

type AdjustedLine = {
  tax_lines?: { rate: number }[] | null
  adjustments?:
    | { code?: string | null; amount: number; is_tax_inclusive?: boolean }[]
    | null
}

export const getDiscountsByCode = (
  source: {
    items?: AdjustedLine[] | null
    shipping_methods?: AdjustedLine[] | null
  },
  isTaxInclusive: boolean
): Record<string, number> => {
  const discounts: Record<string, number> = {}

  for (const line of [
    ...(source.items ?? []),
    ...(source.shipping_methods ?? []),
  ]) {
    const taxRate =
      (line.tax_lines ?? []).reduce((sum, taxLine) => sum + taxLine.rate, 0) /
      100

    for (const adjustment of line.adjustments ?? []) {
      if (!adjustment.code) continue

      const subtotal = adjustment.is_tax_inclusive
        ? adjustment.amount / (1 + taxRate)
        : adjustment.amount

      discounts[adjustment.code] =
        (discounts[adjustment.code] ?? 0) +
        (isTaxInclusive ? subtotal * (1 + taxRate) : subtotal)
    }
  }

  return discounts
}
