import { ExecArgs } from '@medusajs/framework/types';
import { Modules } from '@medusajs/framework/utils';
import type { SearchTypes } from '@medusajs/framework/types';

export default async function indexProducts({ container }: ExecArgs) {
  const logger = container.resolve('logger');
  const searchModule = container.resolve(
    Modules.SEARCH,
  ) as SearchTypes.ISearchModuleService;
  const result = await searchModule.reindex({ index: 'product' });
  logger.info(`Started product search reindex job ${result.job_id}`);
}
