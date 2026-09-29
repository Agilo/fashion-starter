import { ExecArgs } from '@medusajs/framework/types';
import { Modules } from '@medusajs/framework/utils';
import { MeiliSearchService } from '../modules/meilisearch/service';

export default async function indexProducts({ container }: ExecArgs) {
  const logger = container.resolve('logger');

  const meilisearchService = container.resolve(
    'meilisearchService',
  ) as MeiliSearchService;

  const productModuleService = container.resolve(Modules.PRODUCT);

  const [products, count] = await productModuleService.listAndCountProducts(
    undefined,
    {
      relations: [
        'variants',
        'options',
        'tags',
        'collection',
        'type',
        'images',
        'categories',
      ],
    },
  );

  logger.info(`Adding ${count} products to MeiliSearch...`);

  await meilisearchService.addDocuments('products', products, 'products');

  logger.info('Products added to MeiliSearch');
}
