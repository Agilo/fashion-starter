import type { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { Modules } from "@medusajs/framework/utils";
import { ISearchService } from "@medusajs/framework/types";

export default async function indexProductHandler({
  event: { data, name },
  container,
}: SubscriberArgs<{ id: string }>) {
  const productId = data.id;

  const logger = container.resolve("logger");
  const productModuleService = container.resolve(Modules.PRODUCT);
  const meilisearchService = container.resolve(
    "meilisearchService",
  ) as ISearchService;

  if (name === "product.deleted") {
    await meilisearchService.deleteDocument("products", productId);
    logger.info(`The product ${productId} was deleted from MeiliSearch`);
    return;
  }

  const product = await productModuleService.retrieveProduct(productId, {
    relations: [
      "variants",
      "options",
      "tags",
      "collection",
      "type",
      "images",
      "categories",
    ],
  });

  if (name === "product.updated") {
    await meilisearchService.replaceDocuments(
      "products",
      [product],
      "products",
    );
    logger.info(
      `The product ${productId} ${product.title} was updated in MeiliSearch`,
    );
    return;
  }

  await meilisearchService.addDocuments("products", [product], "products");
  logger.info(
    `The product ${productId} ${product.title} was added to MeiliSearch`,
  );
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated", "product.deleted"],
};
