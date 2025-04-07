import { sdk } from "@lib/config"
import { getProductsList } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

export const retrieveCollection = async function (id: string) {
  return sdk.client
    .fetch<{ collection: HttpTypes.StoreCollection }>(
      `/store/collections/${id}`,
      {
        next: { tags: ["collections"] },
        cache: "force-cache",
      }
    )
    .then(({ collection }) => collection)
}

export const getCollectionsList = async function (
  offset: number = 0,
  limit: number = 100,
  fields?: (keyof HttpTypes.StoreCollection)[]
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> {
  return sdk.client
    .fetch<{
      collections: HttpTypes.StoreCollection[]
      count: number
    }>("/store/collections", {
      query: { limit, offset, fields: fields ? fields.join(",") : undefined },
      next: { tags: ["collections"] },
      cache: "force-cache",
    })
    .then(({ collections }) => ({ collections, count: collections.length }))
}

export const getCollectionByHandle = async function (
  handle: string,
  fields?: (keyof HttpTypes.StoreCollection)[]
): Promise<HttpTypes.StoreCollection> {
  return sdk.client
    .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
      query: {
        handle,
        fields: fields ? fields.join(",") : undefined,
        limit: 1,
      },
      next: { tags: ["collections"] },
      cache: "force-cache",
    })
    .then(({ collections }) => collections[0])
}

export const getCollectionsWithProducts = async (
  countryCode: string
): Promise<HttpTypes.StoreCollection[] | null> => {
  const { collections } = await getCollectionsList(0, 3)

  if (!collections) {
    return null
  }

  const collectionIds = collections
    .map((collection) => collection.id)
    .filter(Boolean) as string[]

  const { response } = await getProductsList({
    queryParams: { collection_id: collectionIds },
    countryCode,
  })

  response.products.forEach((product) => {
    const collection = collections.find(
      (collection) => collection.id === product.collection_id
    )

    if (collection) {
      if (!collection.products) {
        collection.products = []
      }

      collection.products.push(product)
    }
  })

  return collections as unknown as HttpTypes.StoreCollection[]
}
