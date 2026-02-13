// External components
import { Text, Heading, Button } from '@react-email/components';

// Types
import { CustomerDTO } from '@medusajs/framework/types';

// Components
import EmailLayout, { EmailLayoutProps } from './components/EmailLayout';

type Props = {
  customer: Pick<CustomerDTO, 'id' | 'email' | 'first_name' | 'last_name'>;
  token: string;
};

export default function AuthPasswordResetEmail({
  customer,
  token,
  ...emailLayoutProps
}: Props & EmailLayoutProps) {
  return (
    <EmailLayout {...emailLayoutProps}>
      <Heading className="text-2xl mt-0 mb-10 font-medium">
        Reset your password
      </Heading>
      <Text className="text-md !mb-10">
        We received a request to reset your Sofa Society account password. Click
        below to set a new password:
      </Text>
      <Button
        href={`${
          process.env.STOREFRONT_URL || 'http://localhost:8000'
        }/auth/reset-password?email=${encodeURIComponent(
          customer.email,
        )}&token=${encodeURIComponent(token)}`}
        className="inline-flex items-center rounded-xs justify-center bg-black text-white h-10 px-6 mb-10"
      >
        Reset password
      </Button>
      <Text className="text-md text-grayscale-500 m-0">
        If you didn&apos;t request this change, please ignore this email, and
        your current password will remain unchanged.
      </Text>
    </EmailLayout>
  );
}

AuthPasswordResetEmail.PreviewProps = {
  customer: {
    id: '1',
    email: 'example@medusa.local',
    first_name: 'John',
    last_name: 'Doe',
  },
  token: '1234567789012345677890',
} satisfies Props;
