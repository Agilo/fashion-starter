// External packages
import { Text, Heading, Button } from '@react-email/components';

// Components
import EmailLayout, { EmailLayoutProps } from './components/EmailLayout';

export default function AuthEmailConfirm({
  ...emailLayoutProps
}: EmailLayoutProps) {
  return (
    <EmailLayout {...emailLayoutProps}>
      <Heading className="text-2xl mt-0 mb-11 font-medium">
        Verify your email
      </Heading>
      <Text className="text-md !mb-10">
        Hey Jovana, thanks for registering for an account on Sofa Society!
      </Text>
      <Text className="text-md !mb-10">
        Before we get started, we just need to confirm that this is you.
        <br />
        Click below to verify your email address:
      </Text>
      <Button className="inline-flex items-center rounded-xs justify-center transition-colors bg-black text-white h-10 px-6">
        Verify email
      </Button>
    </EmailLayout>
  );
}
