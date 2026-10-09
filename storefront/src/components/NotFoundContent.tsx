import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedButtonLink } from "@/components/LocalizedLink"

export const NotFoundContent: React.FC = () => (
  <Layout className="pt-30 pb-20 md:pt-47 md:pb-36">
    <LayoutColumn start={1} end={{ base: 13, lg: 7, xl: 8 }}>
      <h1 className="text-xl md:text-3xl max-lg:mb-8 text-black">
        404
        <br /> Page not found
      </h1>
    </LayoutColumn>
    <LayoutColumn start={{ base: 1, lg: 7, xl: 8 }} end={13}>
      <div className="md:text-md mb-8 lg:pt-18 text-black">
        <p>
          The page you are looking for doesn&apos;t exist or an error occurred.
          Go back, or head over to our home page.
        </p>
      </div>
      <LocalizedButtonLink href="/">Back to home</LocalizedButtonLink>
    </LayoutColumn>
  </Layout>
)
