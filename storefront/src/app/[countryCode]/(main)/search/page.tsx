import { Metadata } from "next"
import { Layout, LayoutColumn } from "@/components/Layout"
import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { CollectionsSlider } from "@modules/store/components/collections-slider"
import { searchProducts } from "@lib/data/search"
import { getRegion } from "@lib/data/regions"
import { NoResults } from "@modules/store/components/no-results.tsx"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ query: string; page: string }>
}

export const metadata: Metadata = {
  title: "Search",
  description: "Search for products",
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const { query, page } = await searchParams

  const pageNumber = page ? parseInt(page, 10) : 1

  const results = await searchProducts(query, 100)
  const region = await getRegion(countryCode)

  return (
    <div className="md:pt-47 py-26 md:pb-36">
      <Layout>
        <LayoutColumn>
          <h2 className="mb-8 md:mb-16 text-lg md:text-2xl">
            Search results for &apos;{query}&apos;
          </h2>
        </LayoutColumn>
      </Layout>
      <Suspense fallback={<SkeletonProductGrid />}>
        {!results.hits.length ? (
          <Layout className="mb-16">
            <NoResults />
          </Layout>
        ) : region && (
          <PaginatedProducts
            sortBy="created_at"
            page={pageNumber}
            countryCode={countryCode}
            collectionId={undefined}
            categoryId={undefined}
            productsIds={results.hits.map((hit) => hit.id)}
            typeId={undefined}
          />
        )}
      </Suspense>
      <CollectionsSlider
        heading="Checkout our collections for more products"
        className="mt-26 md:mt-36 !mb-0"
      />
    </div>
  )
}
