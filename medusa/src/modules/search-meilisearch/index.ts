import { ModuleProvider, Modules } from '@medusajs/framework/utils';
import MeilisearchSearchProvider from './service';

export default ModuleProvider(Modules.SEARCH, {
  services: [MeilisearchSearchProvider],
});
