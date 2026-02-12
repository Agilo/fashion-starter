import {
  createSelectParams,
  createFindParams,
  createOperatorMap,
} from '@medusajs/medusa/api/utils/validators';
import { z } from '@medusajs/framework/zod';

export type AdminGetProductTypeParamsType = z.infer<
  typeof AdminGetProductTypeParams
>;
export const AdminGetProductTypeParams = createSelectParams();

export type AdminGetProductTypesParamsType = z.infer<
  typeof AdminGetProductTypesParams
>;
export const AdminGetProductTypesParams = createFindParams({
  limit: 10,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    value: z.union([z.string(), z.array(z.string())]).optional(),
    // TODO: To be added in next iteration
    // discount_condition_id: z.string().nullish(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    $and: z.lazy(() => AdminGetProductTypesParams.array()).optional(),
    $or: z.lazy(() => AdminGetProductTypesParams.array()).optional(),
  }),
);
