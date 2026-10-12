import { sdk } from '@lib/config';
import type { SearchTypes } from '@medusajs/types';

export async function searchProducts(
  query: string,
  take = 20,
  signal?: AbortSignal
) {
  const { results } = await sdk.client.fetch<{
    results: SearchTypes.SearchResult[];
  }>('/store/search', {
    method: 'POST',
    body: {
      entity: 'product',
      fields: ['id'],
      filters: { q: query },
      pagination: { take },
      search_options: {
        match_strategy: 'last',
        typo_tolerance: true,
      },
    },
    cache: 'no-store',
    signal,
  });

  return results[0] ?? {
    hits: [],
    metadata: { skip: 0, take, count: 0, query },
  };
}
