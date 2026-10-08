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
