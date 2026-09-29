import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from '@medusajs/framework/workflows-sdk';
import { Modules } from '@medusajs/framework/utils';
import type { SearchTypes } from '@medusajs/framework/types';

const reindexProductsStep = createStep(
  {
    name: 'reindexProductsStep',
  },
  async (_input: undefined, context) => {
    const searchModule = context.container.resolve(
      Modules.SEARCH,
    ) as SearchTypes.ISearchModuleService;
    const result = await searchModule.reindex({ index: 'product' });
    return new StepResponse(result);
  },
);

export const indexProductsWorkflow = createWorkflow(
  {
    name: 'indexProducts',
    idempotent: true,
    retentionTime: 60 * 60 * 24 * 3, // 3 days
    store: true,
  },
  () => {
    const result = reindexProductsStep();

    return new WorkflowResponse(result);
  },
);
