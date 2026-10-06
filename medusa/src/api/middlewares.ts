import { configureStoreSearch, defineMiddlewares } from '@medusajs/framework/http';
import { adminProductTypeRoutesMiddlewares } from './store/custom/product-types/middlewares';
import { authenticate } from '@medusajs/framework';

export default defineMiddlewares([
  ...adminProductTypeRoutesMiddlewares,
  {
    matcher: '/store/search',
    middlewares: [
      configureStoreSearch({
        allowed_indexes: { product: true },
      }),
    ],
  },
  {
    method: 'ALL',
    matcher: '/store/custom/customer/*',
    middlewares: [authenticate('customer', ['session', 'bearer'])],
  },
]);
