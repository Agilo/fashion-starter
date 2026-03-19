const { loadEnv, defineConfig } = require('@medusajs/framework/utils');

loadEnv(process.env.NODE_ENV, process.cwd());

module.exports = defineConfig({
  admin: {
    backendUrl:
      process.env.BACKEND_URL ?? 'https://sofa-society-starter.medusajs.app',
    storefrontUrl: process.env.STOREFRONT_URL,
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },
  },
  modules: [
    {
      resolve: '@medusajs/medusa/payment',
      options: {
        providers: [
          {
            id: 'stripe',
            resolve: '@medusajs/medusa/payment-stripe',
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            },
          },
        ],
      },
    },
    {
      resolve: './src/modules/fashion',
    },
    {
      resolve: '@medusajs/medusa/file',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/file-s3',
            id: 's3',
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
              additional_client_config: {
                forcePathStyle:
                  process.env.S3_FORCE_PATH_STYLE === 'true' ? true : undefined,
              },
            },
          },
        ],
      },
    },
    {
      resolve: '@medusajs/medusa/notification',
      options: {
        providers: [
          {
            resolve: './src/modules/resend',
            id: 'resend',
            options: {
              channels: ['email'],
              api_key: process.env.RESEND_API_KEY,
              from: process.env.RESEND_FROM,
              siteTitle: 'SofaSocietyCo.',
              companyName: 'Sofa Society',
              footerLinks: [
                {
                  url: 'https://agilo.com',
                  label: 'Agilo',
                },
                {
                  url: 'https://www.instagram.com/agiloltd/',
                  label: 'Instagram',
                },
                {
                  url: 'https://www.linkedin.com/company/agilo/',
                  label: 'LinkedIn',
                },
              ],
            },
          },
        ],
      },
    },
    {
      resolve: '@medusajs/medusa/event-bus-redis',
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: '@medusajs/medusa/caching',
      options: {
        providers: [
          {
            resolve: '@medusajs/caching-redis',
            id: 'caching-redis',
            is_default: true,
            options: {
              redisUrl: process.env.REDIS_URL,
            },
          },
        ],
      },
    },
    {
      resolve: '@medusajs/medusa/workflow-engine-redis',
      options: {
        redis: {
          redisUrl: process.env.REDIS_URL,
        },
      },
    },
    {
      resolve: '@medusajs/medusa/locking',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/locking-redis',
            id: 'locking-redis',
            is_default: true,
            options: {
              redisUrl: process.env.REDIS_URL,
            },
          },
        ],
      },
    },
    {
      resolve: './src/modules/meilisearch',
      /**
       * @type {import('./src/modules/meilisearch/types').MeiliSearchPluginOptions}
       */
      options: {
        config: {
          host:
            process.env.MEILISEARCH_HOST ??
            'https://fashion-starter-search.agilo.agency',
          apiKey: process.env.MEILISEARCH_API_KEY,
        },
        settings: {
          products: {
            indexSettings: {
              searchableAttributes: [
                'title',
                'subtitle',
                'description',
                'collection',
                'categories',
                'type',
                'tags',
                'variants',
                'sku',
              ],
              displayedAttributes: [
                'id',
                'title',
                'handle',
                'subtitle',
                'description',
                'is_giftcard',
                'status',
                'thumbnail',
                'collection',
                'collection_handle',
                'categories',
                'categories_handle',
                'type',
                'tags',
                'variants',
                'sku',
              ],
            },
            primaryKey: 'id',
            /**
             * @param {import('@medusajs/types').ProductDTO} product
             */
            transformer: (product) => {
              return {
                id: product.id,
                title: product.title,
                handle: product.handle,
                subtitle: product.subtitle,
                description: product.description,
                is_giftcard: product.is_giftcard,
                status: product.status,
                thumbnail: product.images?.[0]?.url ?? null,
                collection: product.collection.title,
                collection_handle: product.collection.handle,
                categories:
                  product.categories?.map((category) => category.name) ?? [],
                categories_handle:
                  product.categories?.map((category) => category.handle) ?? [],
                type: product.type?.value,
                tags: product.tags.map((tag) => tag.value),
                variants: product.variants.map((variant) => variant.title),
                sku: product.variants
                  .filter(
                    (variant) => typeof variant.sku === 'string' && variant.sku,
                  )
                  .map((variant) => variant.sku),
              };
            },
          },
        },
      },
    },
  ],
  plugins: [
    {
      resolve: '@agilo/medusa-analytics-plugin',
      options: {},
    },
  ],
});
