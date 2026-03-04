"use client"
import EmptyCartMessage from "@modules/cart/components/empty-cart-message"
import ItemsTemplate from "@modules/cart/templates/items"
import Summary from "@modules/cart/templates/summary"
import { Layout, LayoutColumn } from "@/components/Layout"
import { useCart } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"
import SkeletonCartPage from "@modules/skeletons/templates/skeleton-cart-page"

// TODO: Ask customer if they want to sign in or continue as guest
const CartTemplate = () => {
  const { data: cart, isPending } = useCart({ enabled: true })
  if (isPending) {
    return <SkeletonCartPage />
  }
  return (
    <Layout className="py-26 md:pb-36 md:pt-39">
      {cart?.items?.length ? (
        <>
          <LayoutColumn
            start={1}
            end={{ base: 13, lg: 9, xl: 10 }}
            className="mb-8 lg:mb-0"
          >
            <ItemsTemplate
              items={cart?.items}
              currencyCode={cart?.currency_code}
            />
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 9, xl: 10 }} end={13}>
            {cart && cart.region && <Summary cart={cart} />}
          </LayoutColumn>
        </>
      ) : (
        <LayoutColumn start={1} end={{ base: 13 }} className="mb-14 lg:mb-0">
          <EmptyCartMessage />
        </LayoutColumn>
      )}
    </Layout>
  )
}

export default withReactQueryProvider(CartTemplate)
