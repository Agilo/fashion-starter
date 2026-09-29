import type { Logger, SearchTypes } from '@medusajs/framework/types';
import { AbstractSearchProviderService } from '@medusajs/framework/utils';
// @ts-ignore Meilisearch publishes dual ESM/CommonJS exports; Medusa compiles this service to CommonJS.
import { MeiliSearch } from 'meilisearch';

type ProviderOptions = {
  host: string;
  apiKey?: string;
};

type InjectedDependencies = { logger: Logger };

type MeiliTask = { taskUid: number; status: string };

const taskResult = (index: string, task: MeiliTask): SearchTypes.SearchTask => ({
  id: String(task.taskUid),
  index,
  status: task.status === 'succeeded' ? 'succeeded' : task.status === 'failed' ? 'failed' : 'enqueued',
});

const quote = (value: unknown) => {
  if (value instanceof Date) value = value.toISOString();
  if (typeof value === 'string') return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  if (value === null) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  throw new Error(`Unsupported Meilisearch filter value: ${String(value)}`);
};

function compileFilters(filters: SearchTypes.SearchFilters): string[] {
  const clauses: string[] = [];
  for (const [field, value] of Object.entries(filters)) {
    if (value === undefined || field === 'q') continue;
    if (field === '$and' || field === '$or') {
      const joiner = field === '$and' ? ' AND ' : ' OR ';
      const children = (value as SearchTypes.SearchFilters[])
        .map((child) => compileFilters(child).join(' AND '))
        .filter(Boolean)
        .map((part) => `(${part})`);
      if (children.length) clauses.push(children.join(joiner));
      continue;
    }
    if (field === '$not') {
      const children = compileFilters(value as SearchTypes.SearchFilters);
      if (children.length) clauses.push(`NOT (${children.join(' AND ')})`);
      continue;
    }
    if (Array.isArray(value)) {
      clauses.push(`${field} IN [${value.map(quote).join(', ')}]`);
      continue;
    }
    if (value && typeof value === 'object' && !(value instanceof Date)) {
      for (const [operator, operand] of Object.entries(value)) {
        const values = Array.isArray(operand) ? operand : [operand];
        if (operator === '$eq' || operator === '$contains') clauses.push(`${field} = ${quote(values[0])}`);
        else if (operator === '$ne') clauses.push(`${field} != ${quote(operand)}`);
        else if (operator === '$in' || operator === '$overlaps') clauses.push(`${field} IN [${values.map(quote).join(', ')}]`);
        else if (operator === '$nin') clauses.push(`NOT ${field} IN [${values.map(quote).join(', ')}]`);
        else if (operator === '$lt') clauses.push(`${field} < ${quote(operand)}`);
        else if (operator === '$lte') clauses.push(`${field} <= ${quote(operand)}`);
        else if (operator === '$gt') clauses.push(`${field} > ${quote(operand)}`);
        else if (operator === '$gte') clauses.push(`${field} >= ${quote(operand)}`);
        else if (operator === '$exists') clauses.push(`${field} ${operand ? 'IS NOT NULL' : 'IS NULL'}`);
        else throw new Error(`Meilisearch provider does not support the ${operator} filter operator`);
      }
      continue;
    }
    clauses.push(`${field} = ${quote(value)}`);
  }
  return clauses;
}

function flattenFields(fields: Record<string, SearchTypes.SearchFieldDefinition>, prefix = '') {
  return Object.entries(fields).flatMap(([name, definition]) => {
    const path = prefix ? `${prefix}.${name}` : name;
    return definition.type === 'object' && definition.fields
      ? flattenFields(definition.fields, path)
      : [{ path, definition }];
  });
}

export default class MeilisearchSearchProvider extends AbstractSearchProviderService {
  static identifier = 'search-meilisearch';

  protected logger_: Logger;
  protected client: MeiliSearch;

  constructor({ logger }: InjectedDependencies, options: ProviderOptions) {
    super();
    if (!options.host) throw new Error('MEILISEARCH_HOST is required.');
    if (process.env.NODE_ENV === 'production' && !options.apiKey) {
      throw new Error('MEILISEARCH_API_KEY is required in production.');
    }
    this.logger_ = logger;
    this.client = new MeiliSearch({ host: options.host, apiKey: options.apiKey });
  }

  async upsertIndex({ index }: { index: SearchTypes.ResolvedSearchIndexDefinition }): Promise<SearchTypes.SearchTask> {
    const name = index.physical_name;
    try {
      await this.client.getIndex(name);
    } catch (error) {
      const code = (error as { cause?: { code?: string }; code?: string }).cause?.code ?? (error as { code?: string }).code;
      if (code !== 'index_not_found') throw error;
      const task = await this.client.createIndex(name, { primaryKey: index.primary_key });
      await this.client.tasks.waitForTask(task.taskUid);
    }

    const fields = flattenFields(index.fields);
    const providerOptions = index.settings.provider_options?.[MeilisearchSearchProvider.identifier] ?? {};
    const settings = {
      searchableAttributes: fields.filter(({ definition }) => definition.searchable).map(({ path }) => path),
      filterableAttributes: fields.filter(({ definition }) => definition.filterable || definition.facetable).map(({ path }) => path),
      sortableAttributes: fields.filter(({ definition }) => definition.sortable).map(({ path }) => path),
      typoTolerance: index.settings.typo_tolerance
        ? {
            enabled: index.settings.typo_tolerance.enabled,
            minWordSizeForTypos: {
              oneTypo: index.settings.typo_tolerance.min_word_size_for_one_typo,
              twoTypos: index.settings.typo_tolerance.min_word_size_for_two_typos,
            },
            disableOnAttributes: index.settings.typo_tolerance.disabled_on_attributes,
          }
        : undefined,
      ...providerOptions,
    };
    return taskResult(name, await this.client.index(name).updateSettings(settings));
  }

  async deleteIndex({ index }: { index: string }): Promise<SearchTypes.SearchTask> {
    return taskResult(index, await this.client.deleteIndex(index));
  }

  async listIndexes(): Promise<SearchTypes.SearchIndexInfo[]> {
    const { results } = await this.client.getIndexes({ limit: 1000 });
    return Promise.all(results.map(async (index) => ({
      name: index.uid,
      provider: MeilisearchSearchProvider.identifier,
      document_count: (await this.client.index(index.uid).getStats()).numberOfDocuments,
      created_at: index.createdAt ? new Date(index.createdAt) : undefined,
      updated_at: index.updatedAt ? new Date(index.updatedAt) : undefined,
    })));
  }

  async upsertDocuments({ index, definition, documents }: { index: string; definition: SearchTypes.ResolvedSearchIndexDefinition; documents: SearchTypes.SearchDocument[] }): Promise<SearchTypes.SearchTask> {
    const task = await this.client.index(index).addDocuments(documents, { primaryKey: definition.primary_key });
    return taskResult(index, task);
  }

  async deleteDocuments({ index, filters }: SearchTypes.SearchDeleteDocumentsInput): Promise<SearchTypes.SearchTask> {
    const task = await this.client.index(index).deleteDocuments({ filter: compileFilters(filters) });
    return taskResult(index, task);
  }

  async clearIndex({ index }: { index: string }): Promise<SearchTypes.SearchTask> {
    return taskResult(index, await this.client.index(index).deleteAllDocuments());
  }

  async search(input: SearchTypes.ProviderSearchQuery): Promise<SearchTypes.SearchResult> {
    const { index, filters = {}, pagination = {}, search_options: options = {} } = input;
    if (options.vector || options.locales?.length || options.match_strategy === 'any' || options.match_strategy === 'last') {
      throw new Error('The requested search option is not supported by this Meilisearch provider.');
    }
    if (pagination.cursor || pagination.order?._score || options.count === 'exact') {
      throw new Error('The requested pagination or count option is not supported by this Meilisearch provider.');
    }
    if (options.highlight) {
      throw new Error('Highlighting is not implemented by this Meilisearch provider.');
    }
    const facets = (options.facets ?? []).map((facet) => typeof facet === 'string' ? facet : facet.field);
    if ((options.facets ?? []).some((facet) => typeof facet !== 'string' && facet.type && facet.type !== 'value')) {
      throw new Error('Meilisearch supports value facets only through this provider.');
    }
    const sort = pagination.order
      ? Object.entries(pagination.order).map(([field, direction]) => `${field}:${direction.toLowerCase()}`)
      : undefined;
    const compiledFilters = compileFilters(filters);
    const response = await this.client.index(index.physical_name).search(input.q ?? '', {
      filter: compiledFilters.length ? compiledFilters : undefined,
      offset: pagination.skip ?? 0,
      limit: pagination.take ?? 20,
      attributesToRetrieve: input.attributes_to_retrieve,
      attributesToSearchOn: options.attributes_to_search_on,
      sort,
      facets,
      matchingStrategy: 'all',
      typoTolerance: options.typo_tolerance === false ? false : undefined,
      showRankingScore: options.include_score,
      rankingScoreThreshold: options.min_score,
      distinct: options.distinct,
      maxValuesPerFacet: facets.length
        ? Math.max(...(options.facets ?? []).map((facet) => typeof facet === 'string' || !('limit' in facet) ? 100 : facet.limit ?? 100))
        : undefined,
    });
    const distribution = response.facetDistribution ?? {};
    const returnedFacets = Object.fromEntries(Object.entries(distribution).map(([field, values]) => [
      field,
      { type: 'value' as const, values: Object.entries(values).map(([value, count]) => ({ value, count })) },
    ]));
    return {
      hits: response.hits.map((hit) => ({
        id: String(hit[index.primary_key] ?? hit.id),
        ...(options.include_score && typeof hit._rankingScore === 'number' ? { score: hit._rankingScore } : {}),
        document: Object.fromEntries(Object.entries(hit).filter(([key]) => !key.startsWith('_'))),
      })),
      facets: returnedFacets,
      metadata: {
        skip: pagination.skip ?? 0,
        take: pagination.take ?? 20,
        count: options.count === 'none' ? null : response.estimatedTotalHits ?? response.totalHits ?? null,
        query: input.q,
        processing_time_ms: response.processingTimeMs,
      },
    };
  }

  async waitForTask(task: SearchTypes.SearchTask, options?: { timeout_ms?: number }): Promise<SearchTypes.SearchTask> {
    if (!task.id || !task.index) return task;
    const result = await this.client.tasks.waitForTask(Number(task.id), { timeout: options?.timeout_ms });
    return {
      ...task,
      status: result.status === 'succeeded' ? 'succeeded' : result.status === 'failed' ? 'failed' : 'processing',
      ...(result.error ? { error: { message: result.error.message, code: result.error.code } } : {}),
    };
  }
}
