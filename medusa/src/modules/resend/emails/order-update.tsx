// External packages
import { Text, Heading, Button } from '@react-email/components';

// Types
import { CustomerDTO, OrderDTO } from '@medusajs/framework/types';

// Components
import EmailLayout, { EmailLayoutProps } from './components/EmailLayout';

type Props = {
  customer: Pick<CustomerDTO, 'id' | 'email' | 'first_name' | 'last_name'>;
  order: Pick<OrderDTO, 'id' | 'display_id'>;
};

export default function OrderUpdateEmail({
  customer,
  order,
  ...emailLayoutProps
}: Props & EmailLayoutProps) {
  return (
    <EmailLayout {...emailLayoutProps}>
      <Heading className="text-2xl mt-0 mb-10 font-medium">
        Shipping update
      </Heading>
      <Text className="text-md !mb-8">
        Great news! Your order #{order.display_id} is now on its way to you.
        <br />
        Here are the shipping details.
      </Text>
      <Text className="text-md !mb-10">
        You can track your package by clicking below:
      </Text>
      <Button
        href={`${
          process.env.STOREFRONT_URL || 'http://localhost:8000'
        }/account/my-orders/${order.id}`}
        className="inline-flex items-center rounded-xs justify-center bg-black text-white h-10 px-6 mb-10"
      >
        Order details
      </Button>
      <Text className="text-md m-0">
        Thank you for choosing Sofa Society. We&apos;re excited for your new
        sofa to find its home with you!
      </Text>
    </EmailLayout>
  );
}

OrderUpdateEmail.PreviewProps = {
  customer: {
    id: '1',
    email: 'example@medusa.local',
    first_name: 'John',
    last_name: 'Doe',
  },
  order: {
    id: 'order_01JCNYH6VADAK90W7CBSPV5BT6',
    display_id: 1,
  },
} satisfies Props;
