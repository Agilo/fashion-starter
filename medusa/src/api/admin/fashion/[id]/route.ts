import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { z } from '@medusajs/framework/zod';
import FashionModuleService from '../../../../modules/fashion/service';
import { FASHION_MODULE } from '../../../../modules/fashion';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const fashionModuleService: FashionModuleService =
    req.scope.resolve(FASHION_MODULE);

  const material = await fashionModuleService.retrieveMaterial(req.params.id, {
    relations: ['colors'],
    withDeleted: true,
  });

  res.status(200).json(material);
};

const updateMaterialBodySchema = z.object({
  name: z.string().min(1),
});

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const fashionModuleService: FashionModuleService =
    req.scope.resolve(FASHION_MODULE);

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const validatedData = updateMaterialBodySchema.parse(body);

  const material = await fashionModuleService.updateMaterials({
    ...validatedData,
    id: req.params.id,
  });

  res.status(200).json(material);
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const fashionModuleService: FashionModuleService =
    req.scope.resolve(FASHION_MODULE);

  await fashionModuleService.softDeleteMaterials(req.params.id);

  const material = await fashionModuleService.retrieveMaterial(req.params.id, {
    relations: ['colors'],
    withDeleted: true,
  });

  res.status(200).json(material);
};
