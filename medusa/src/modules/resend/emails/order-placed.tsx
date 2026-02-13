// External packages
import { Fragment } from 'react';
import {
  Text,
  Column,
  Heading,
  Img,
  Row,
  Section,
  Link,
  Hr,
} from '@react-email/components';
import { HttpTypes } from '@medusajs/framework/types';
import EmailLayout, { EmailLayoutProps } from './components/EmailLayout';

export type OrderPlacedEmailProps = {
  order: Pick<
    HttpTypes.AdminOrder,
    | 'currency_code'
    | 'email'
    | 'shipping_total'
    | 'subtotal'
    | 'total'
    | 'tax_total'
  > & {
    shipping_address:
      | (Pick<
          HttpTypes.AdminOrderAddress,
          | 'first_name'
          | 'last_name'
          | 'address_1'
          | 'address_2'
          | 'city'
          | 'postal_code'
          | 'province'
          | 'phone'
        > & {
          country?: Pick<
            HttpTypes.AdminRegionCountry,
            'iso_2' | 'name' | 'display_name'
          >;
        })
      | null;
    billing_address:
      | (Pick<
          HttpTypes.AdminOrderAddress,
          | 'first_name'
          | 'last_name'
          | 'address_1'
          | 'address_2'
          | 'city'
          | 'postal_code'
          | 'province'
          | 'phone'
        > & {
          country?: Pick<
            HttpTypes.AdminRegionCountry,
            'iso_2' | 'name' | 'display_name'
          >;
        })
      | null;
    items: Pick<
      HttpTypes.AdminOrder['items'][number],
      | 'id'
      | 'thumbnail'
      | 'product_title'
      | 'variant_title'
      | 'total'
      | 'quantity'
      | 'variant_option_values'
    >[];
  };
} & EmailLayoutProps;

export default function OrderPlacedEmail({
  order,
  ...emailLayoutProps
}: OrderPlacedEmailProps) {
  const formatter = new Intl.NumberFormat([], {
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
    currency: order.currency_code,
  });

  return (
    <EmailLayout {...emailLayoutProps}>
      <Heading className="text-2xl font-medium mt-0 mb-10">
        Order confirmation
      </Heading>
      <Text className="text-md !mb-6">
        We are pleased to confirm that your order has been successfully placed
        and will be processed shortly. Your order number is #100002.
      </Text>
      <Text className="text-md !mb-6">
        You&apos;ll receive another update once your order is shipped. For any
        questions, feel free to contact us at info@sofasociety.com.
      </Text>
      <Text className="text-md !mb-20">Thank you for shopping with us!</Text>
      <Section className="mb-6">
        <Row>
          <Column className="border border-solid p-4 border-grayscale-200 rounded-xs">
            <Text className="text-grayscale-500 !mt-0 !mb-8">
              Delivery Address
            </Text>
            <Text className="m-0 leading-tight">
              {[
                order.shipping_address.first_name,
                order.shipping_address.last_name,
              ]
                .filter(Boolean)
                .join(' ')}
            </Text>
            <Text className="m-0 leading-tight">
              {[
                order.shipping_address.address_1,
                order.shipping_address.address_2,
                [
                  order.shipping_address.postal_code,
                  order.shipping_address.city,
                ]
                  .filter(Boolean)
                  .join(' '),
                order.shipping_address.province,
                order.shipping_address.country.display_name,
              ]
                .filter(Boolean)
                .join(', ')}
            </Text>
            {order.shipping_address.phone && (
              <Text className="m-0 leading-tight">
                {order.shipping_address.phone}
              </Text>
            )}
          </Column>
          <Column className="w-8" />
          <Column className="border border-solid p-4 border-grayscale-200 rounded-xs">
            <Text className="text-grayscale-500 !mt-0 !mb-8">
              Billing Address
            </Text>
            <Text className="m-0 leading-tight">
              {[
                order.billing_address.first_name,
                order.billing_address.last_name,
              ]
                .filter(Boolean)
                .join(' ')}
            </Text>
            <Text className="m-0 leading-tight">
              {[
                order.billing_address.address_1,
                order.billing_address.address_2,
                [order.billing_address.postal_code, order.billing_address.city]
                  .filter(Boolean)
                  .join(' '),
                order.billing_address.province,
                order.billing_address.country.display_name,
              ]
                .filter(Boolean)
                .join(', ')}
            </Text>
            {order.billing_address.phone && (
              <Text className="m-0 leading-tight">
                {order.billing_address.phone}
              </Text>
            )}
          </Column>
        </Row>
      </Section>
      <Section className="border border-solid border-grayscale-200 rounded-xs px-4 mb-6">
        {order.items.map((item, index) => {
          return (
            <Fragment key={item.id}>
              {index > 0 && (
                <Hr className="border-t border-solid border-grayscale-100 m-0" />
              )}
              <Row className="py-4">
                <Column>
                  {!!item.thumbnail && (
                    <Link href="/">
                      <Img
                        src={item.thumbnail}
                        alt={item.product_title}
                        className="aspect-[3/4] object-cover max-w-37 float-left"
                      />
                    </Link>
                  )}
                </Column>
                <Column className="w-full pl-8 relative" valign="top">
                  <Text className="text-md !mt-0 !mb-2">
                    {item.product_title}
                  </Text>
                  <Section className="mb-1">
                    {Object.entries(item.variant_option_values).flatMap(
                      ([key, value]) =>
                        typeof value === 'string' ? (
                          <Row key={key}>
                            <Column className="flex">
                              <Text className="text-grayscale-500 m-0 text-xs">
                                {key}:
                              </Text>
                              <Text className="m-0 text-xs ml-2">{value}</Text>
                            </Column>
                          </Row>
                        ) : (
                          []
                        ),
                    )}
                    <Row className="absolute bottom-0">
                      <Column className="flex">
                        <Text className="text-grayscale-500 m-0 text-xs">
                          Quantity:
                        </Text>
                        <Text className="m-0 text-xs ml-2">
                          {item.quantity}
                        </Text>
                      </Column>
                    </Row>
                  </Section>
                </Column>
                <Column valign="bottom">
                  <Text className="m-0 text-md">
                    {formatter.format(item.total)}
                  </Text>
                </Column>
              </Row>
            </Fragment>
          );
        })}
      </Section>
      <Section className="border border-solid border-grayscale-200 rounded-xs p-4">
        <Row>
          <Column className="w-1/2 flex items-center" valign="top">
            <Img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEySURBVHgB7ZbLccIwEIbXz/GMD3EJSgekgigdkAqSzkIHSSrAVAAdWB3A0eMn/4IBY+DGYg76ZtZr2Rrvb2klLZHFMjLO8EEURbqua0UCeJ5n8jxP6ZoABFYI/IvbCcliIOQDQsyZgCAIMjgF2ziO80f3J4FN2rZV8KuyLN+Ob3zf1xDQhmGYJYDkSBBnzbHiON6NtMsX/LHqOqQbQHLw6P7zTVEUJwFjMroAv99AgmjkwQ8JghjvdEsAUOjwTQ9kKGABm5EsXzB9VQAyNEN2zkgQTLHGKB/bdhVYAVbAGAJeaCgA69J0fkr7c1sEPuoRY3cKcnXEvl+QLGlfDRlsSCkJ0DTNFN9OYAYb3uuZAC7J0GHeVSxiIPjKdd3Pi5LsAFdHvQLlrvBUV1WVksXyTGwBvHxnj9a95poAAAAASUVORK5CYII="
              alt="Credit card"
              width="16"
              height="16"
            />
            <Text className="m-0 ml-2">Payment</Text>
          </Column>
          <Column className="w-1/2">
            <Section>
              <Row className="mb-2">
                <Column className="flex">
                  <Text className="text-grayscale-500 m-0 text-base">
                    Subtotal
                  </Text>
                  <Text className="m-0 text-base ml-auto">
                    {formatter.format(order.subtotal)}
                  </Text>
                </Column>
              </Row>
              <Row className="mb-6">
                <Column className="flex">
                  <Text className="text-grayscale-500 m-0 text-base">
                    Shipping
                  </Text>
                  <Text className="m-0 text-base ml-auto">
                    {formatter.format(order.shipping_total)}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column className="flex">
                  <Text className="m-0 text-md">Total</Text>
                  <Text className="m-0 text-md ml-auto">
                    {formatter.format(order.total)}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column className="flex">
                  <Text className="text-grayscale-500 m-0 text-xs">
                    Including
                  </Text>
                  <Text className="m-0 text-xs text-grayscale-500 ml-1">
                    {formatter.format(order.tax_total)} tax
                  </Text>
                </Column>
              </Row>
            </Section>
          </Column>
        </Row>
      </Section>
    </EmailLayout>
  );
}

OrderPlacedEmail.PreviewProps = {
  order: {
    currency_code: 'EUR',
    email: 'example@medusa.local',
    shipping_address: {
      first_name: 'John',
      last_name: 'Doe',
      address_1: '1234 Main St',
      address_2: 'Apt 1',
      city: 'Los Angeles',
      postal_code: '90001',
      country: {
        iso_2: 'US',
        name: 'United States',
        display_name: 'United States',
      },
      phone: '+1 123 456 7890',
      province: 'California',
    },
    billing_address: {
      first_name: 'John',
      last_name: 'Doe',
      address_1: '1234 Main St',
      address_2: 'Apt 1',
      city: 'Los Angeles',
      postal_code: '90001',
      country: {
        iso_2: 'US',
        name: 'United States',
        display_name: 'United States',
      },
      phone: '+1 123 456 7890',
      province: 'California',
    },
    items: [
      {
        id: '1',
        thumbnail:
          'https://fashion-starter-demo.s3.eu-central-1.amazonaws.com/belime-estate-01JAR3JYD68D1YYR0BN7HHMAZE.png',
        product_title: 'Belime Estate',
        variant_title: 'Linen / Red',
        total: 1500,
        quantity: 1,
        variant_option_values: {
          Material: 'Linen',
          Color: 'Red',
        },
      },
    ],
    shipping_total: 100,
    subtotal: 1400,
    total: 1500,
    tax_total: 100,
  },
} satisfies OrderPlacedEmailProps;
