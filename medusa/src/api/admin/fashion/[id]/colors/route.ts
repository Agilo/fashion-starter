import { z } from '@medusajs/framework/zod';
import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import FashionModuleService from '../../../../../modules/fashion/service';
import { FASHION_MODULE } from '../../../../../modules/fashion';

const colorsListQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  deleted: z.coerce.boolean().optional().default(false),
});

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { page, deleted } = colorsListQuerySchema.parse(req.query);

  const fashionModuleService: FashionModuleService =
    req.scope.resolve(FASHION_MODULE);

  const [colors, count] = await fashionModuleService.listAndCountColors(
    deleted
      ? {
          deleted_at: { $lte: new Date() },
          material_id: req.params.id,
        }
      : {
          material_id: req.params.id,
        },
    {
      skip: 20 * (page - 1),
      take: 20,
      withDeleted: deleted,
    },
  );

  const last_page = Math.ceil(count / 20);

  res.status(200).json({ colors, count, page, last_page });
};

const colorsCreateBodySchema = z.object({
  name: z.string().min(1),
  hex_code: z.string().min(7).max(7),
});

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const fashionModuleService: FashionModuleService =
    req.scope.resolve(FASHION_MODULE);

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const validatedData = colorsCreateBodySchema.parse(body);

  const color = await fashionModuleService.createColors({
    ...validatedData,
    material_id: req.params.id,
  });

  res.status(200).json(color);
};
