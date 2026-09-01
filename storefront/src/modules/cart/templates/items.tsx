import { HttpTypes } from "@medusajs/types"

import Item from "@modules/cart/components/item"

type ItemsTemplateProps = {
  items?: HttpTypes.StoreCartLineItem[]
  currencyCode: string
}

const ItemsTemplate = ({ items, currencyCode }: ItemsTemplateProps) => {
  return (
    <div>
      <div className="pb-8 md:pb-12 border-b border-b-grayscale-100">
        <h1 className="md:text-2xl text-md leading-none">Your shopping cart</h1>
      </div>
      <div>
        {items
          ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item key={item.id} item={item} currencyCode={currencyCode} />
                )
              })
          : null}
      </div>
    </div>
  )
}

export default ItemsTemplate
