import { ExecArgs, ISearchService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function indexProducts({ container }: ExecArgs) {
  const logger = container.resolve("logger");

  const meilisearchService = container.resolve(
    "meilisearchService",
  ) as ISearchService;

  const productModuleService = container.resolve(Modules.PRODUCT);

  const [products, count] = await productModuleService.listAndCountProducts(
    undefined,
    {
      relations: [
        "variants",
        "options",
        "tags",
        "collection",
        "type",
        "images",
        "categories",
      ],
    },
  );

  logger.info(`Adding ${count} products to MeiliSearch...`);

  await meilisearchService.addDocuments("products", products, "products");

  logger.info("Products added to MeiliSearch");
}
