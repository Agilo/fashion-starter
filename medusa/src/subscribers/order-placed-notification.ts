import type { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa';
import {
  ContainerRegistrationKeys,
  MathBN,
  Modules,
} from '@medusajs/framework/utils';
import type { OrderPlacedEmailProps } from '../modules/resend/emails/order-placed';

type Country = {
  iso_2: string;
  name: string;
  display_name: string;
};

type MathBNInput = Parameters<typeof MathBN.convert>[0];

const toNumber = (value: MathBNInput | null | undefined): number =>
  MathBN.convert(value ?? 0).toNumber();

const buildVariantOptionValues = (item: {
  variant_option_values?: Record<string, unknown>;
  variant?: { options?: unknown[] };
}): Record<string, string> => {
  if (
    item.variant_option_values &&
    Object.keys(item.variant_option_values).length
  ) {
    return Object.entries(item.variant_option_values).reduce<
      Record<string, string>
    >((acc, [key, value]) => {
      if (typeof value === 'string') {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  return (
    item.variant?.options?.reduce<Record<string, string>>((acc, option) => {
      if (!option || typeof option !== 'object') {
        return acc;
      }

      const optionRecord = option as Record<string, unknown>;
      const optionObject = optionRecord.option;
      const optionTitle =
        optionObject && typeof optionObject === 'object'
          ? (optionObject as Record<string, unknown>).title
          : undefined;
      const optionValue = optionRecord.value;

      if (typeof optionTitle === 'string' && typeof optionValue === 'string') {
        acc[optionTitle] = optionValue;
      }

      return acc;
    }, {}) ?? {}
  );
};

export default async function sendOrderConfirmationHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const notificationModuleService = container.resolve(Modules.NOTIFICATION);

  const {
    data: [order],
  } = await query.graph({
    entity: 'order',
    fields: [
      'id',
      'currency_code',
      'total',
      'subtotal',
      'tax_total',
      'discount_total',
      'discount_tax_total',
      'original_total',
      'original_tax_total',
      'item_total',
      'item_subtotal',
      'item_tax_total',
      'original_item_total',
      'original_item_subtotal',
      'original_item_tax_total',
      'shipping_total',
      'shipping_subtotal',
      'shipping_tax_total',
      'original_shipping_tax_total',
      'original_shipping_subtotal',
      'original_shipping_total',
      'email',
      'shipping_address.*',
      'billing_address.*',
      'customer_id',
      'items.*',
      'items.variant.options.value',
      'items.variant.options.option.title',
      'summary.*',
    ],
    filters: { id: data.id },
  });

  if (!order || !order.email) {
    return;
  }

  const countryCodes = [
    order.shipping_address?.country_code,
    order.billing_address?.country_code,
  ].filter(Boolean);

  const countryMap: Map<string, Country> = new Map();

  if (countryCodes.length > 0) {
    const { data: countries } = await query.graph({
      entity: 'country',
      fields: ['iso_2', 'name', 'display_name'],
      filters: {
        iso_2: countryCodes,
      },
    });

    countries.forEach((country) => {
      countryMap.set(country.iso_2, {
        iso_2: country.iso_2,
        name: country.name,
        display_name: country.display_name,
      });
    });
  }

  const getFallbackCountry = (countryCode: string): Country => ({
    iso_2: countryCode,
    name: countryCode.toUpperCase(),
    display_name: countryCode.toUpperCase(),
  });

  const shippingAddressForEmail = order.shipping_address
    ? {
        ...order.shipping_address,
        country: order.shipping_address.country_code
          ? (countryMap.get(order.shipping_address.country_code) ??
            getFallbackCountry(order.shipping_address.country_code))
          : undefined,
      }
    : order.shipping_address;

  const billingAddressForEmail = order.billing_address
    ? {
        ...order.billing_address,
        country: order.billing_address.country_code
          ? (countryMap.get(order.billing_address.country_code) ??
            getFallbackCountry(order.billing_address.country_code))
          : undefined,
      }
    : order.billing_address;

  const transformedItems = order.items.map((item) => ({
    id: item.id,
    quantity: Math.trunc(toNumber(item.quantity)),
    total: toNumber(item.total),
    thumbnail:
      item.thumbnail ??
      item.product.thumbnail ??
      item.product.images?.[0]?.url ??
      null,
    product_title: item.product_title ?? '',
    variant_title: item.variant_title ?? '',
    variant_option_values: buildVariantOptionValues(item),
  }));

  const orderForEmail = {
    ...order,
    subtotal: toNumber(order.subtotal),
    shipping_total: toNumber(order.shipping_total),
    total: toNumber(order.total),
    tax_total: toNumber(order.tax_total),
    shipping_address: shippingAddressForEmail,
    billing_address: billingAddressForEmail,
    items: transformedItems,
  };

  await notificationModuleService.createNotifications({
    to: order.email,
    channel: 'email',
    template: 'order-placed',
    data: { order: orderForEmail } satisfies OrderPlacedEmailProps,
  });
}

export const config: SubscriberConfig = {
  event: 'order.placed',
};
