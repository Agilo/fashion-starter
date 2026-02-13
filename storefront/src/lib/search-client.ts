import { MeiliSearch } from "meilisearch"

const endpoint =
  process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || "http://localhost:7700"

const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || "test_key"

export interface MeiliSearchProductHit {
  id: string
  handle: string
  title: string
  thumbnail: string
  variants: string[]
}

export const searchClient = new MeiliSearch({
  host: endpoint,
  apiKey,
})
