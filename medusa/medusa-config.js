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
    },
  },
  modules: [
    {
      resolve: '@medusajs/medusa/payment',
      options: {
        providers: [
          // {
          //   id: 'stripe',
          //   resolve: '@medusajs/medusa/payment-stripe',
          //   options: {
          //     apiKey: process.env.STRIPE_API_KEY,
          //     webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
          //   },
          // },
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
              file_url: "https://esecosmetics.s3.us-east-1.amazonaws.com",
              access_key_id: "AKIATCKATWV5OE344J4M",
              secret_access_key: "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",
              region: "us-east-1",
              bucket: "esecosmetics",
              endpoint: "https://s3.us-east-1.amazonaws.com"
            }
          }
        ],
      },
    },
  ],
});
