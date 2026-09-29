// @ts-ignore
import { MeiliSearch, MeiliSearchApiError, Settings } from 'meilisearch';
import { MeiliSearchPluginOptions } from './types';
import { logger } from '@medusajs/framework';

export class MeiliSearchService {
  static identifier = 'meilisearch';

  isDefault = false;

  protected readonly client: MeiliSearch;
  protected readonly options: MeiliSearchPluginOptions;

  constructor(container: any, options: MeiliSearchPluginOptions) {
    this.options = options;

    if (process.env.NODE_ENV !== 'development') {
      if (!options.config?.apiKey) {
        throw Error(
          'MeiliSearch API key is required for production environments.',
        );
      }
    }

    if (!options.config?.host) {
      throw Error(
        'MeiliSearch host is required. Please provide a host in the configuration.',
      );
    }

    this.client = new MeiliSearch(options.config);
  }

  async createIndex(
    indexName: string,
    options: Record<string, unknown> = { primaryKey: 'id' },
  ) {
    return this.client.createIndex(indexName, options);
  }

  getIndex(indexName: string) {
    return this.client.index(indexName);
  }

  async addDocuments(
    indexName: string,
    documents: Record<string, any>[],
    type: string,
  ) {
    const indexSetting = this.options.settings?.[indexName];
    const transformer = indexSetting?.transformer ?? ((doc: any) => doc);
    const primaryKey = indexSetting?.primaryKey ?? 'id';

    return this.client
      .index(indexName)
      .addDocuments(documents.map(transformer), { primaryKey });
  }

  async replaceDocuments(
    indexName: string,
    documents: Record<string, any>[],
    type: string,
  ) {
    return this.addDocuments(indexName, documents, type);
  }

  async deleteDocument(indexName: string, documentId: string) {
    return this.client.index(indexName).deleteDocument(documentId);
  }

  async deleteAllDocuments(indexName: string) {
    return this.client.index(indexName).deleteAllDocuments();
  }

  async search(indexName: string, query: string, options: Record<string, any>) {
    const { paginationOptions, filter, additionalOptions } = options;

    return this.client
      .index(indexName)
      .search(query, { filter, ...paginationOptions, ...additionalOptions });
  }

  async updateSettings(
    indexName: string,
    settings: { indexSettings: Settings; primaryKey?: string },
  ) {
    const indexSettings = settings.indexSettings ?? {};

    try {
      await this.client.getIndex(indexName);
    } catch (error) {
      if (
        error instanceof MeiliSearchApiError &&
        error.cause?.code === 'index_not_found'
      ) {
        await this.createIndex(indexName, {
          primaryKey: settings.primaryKey ?? 'id',
        });
      } else {
        logger.error(error);
        throw error;
      }
    }

    return this.client.index(indexName).updateSettings(indexSettings);
  }
}
