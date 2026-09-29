import {
  defineSearchIndex,
  graphConsume,
  graphSeed,
  search,
} from '@medusajs/framework/utils';

const source = {
  fields: ['id', 'title', 'handle', 'thumbnail', 'status'],
};

export default defineSearchIndex({
  name: 'product',
  entity: 'product',
  fields: search.define({
    id: search.keyword().filterable(),
    title: search.text().searchable(),
    handle: search.keyword().filterable(),
    thumbnail: search.keyword(),
    status: search.keyword().filterable().retrievable(false),
  }),
  events: ['product.created', 'product.updated', 'product.deleted'],
  consume: graphConsume(source),
  seed: graphSeed(source),
});
