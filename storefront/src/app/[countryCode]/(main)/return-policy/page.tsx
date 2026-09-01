import { Metadata } from "next"
import { Icon } from "@/components/Icon"

export const metadata: Metadata = {
  title: "Return Policy",
  description: "Learn about our return and refund policy",
}

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-lg md:text-xl font-semibold mb-8">Return Policy</h1>

      <div className="prose prose-grayscale max-w-none">
        <section className="mb-8">
          <h2 className="text-md font-semibold mb-4">Return Window</h2>
          <p className="text-grayscale-600 mb-4">
            You have 30 days from the date of delivery to return most items for
            a full refund. Items must be in their original condition with all
            tags attached.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-md font-semibold mb-4">Eligibility</h2>
          <p className="text-grayscale-600 mb-4">
            To be eligible for a return, your item must meet the following
            criteria:
          </p>
          <ul className="list-disc list-inside space-y-2 text-grayscale-600">
            <li>Unworn and unwashed</li>
            <li>In original packaging with all tags attached</li>
            <li>Not marked as final sale or non-returnable</li>
            <li>Returned within 30 days of delivery</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-md font-semibold mb-4">Non-Returnable Items</h2>
          <p className="text-grayscale-600 mb-4">
            The following items cannot be returned:
          </p>
          <ul className="list-disc list-inside space-y-2 text-grayscale-600">
            <li>Intimate apparel and swimwear</li>
            <li>Personalized or custom-made items</li>
            <li>Items marked as final sale</li>
            <li>Gift cards</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-md font-semibold mb-4">Refund Process</h2>
          <p className="text-grayscale-600 mb-4">
            Once we receive and inspect your return, we will process your refund
            within 5-10 business days. Refunds will be credited to your original
            payment method.
          </p>
          <div className="bg-grayscale-50 rounded-xs p-4 mt-4">
            <div className="flex items-start gap-3">
              <Icon name="info" className="w-5 h-5 text-grayscale-500 mt-0.5" />
              <p className="text-sm text-grayscale-600">
                <strong>Store Credit Option:</strong> Choose store credit for
                your refund and receive a 10% bonus on your refund amount!
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-md font-semibold mb-4">How to Start a Return</h2>
          <ol className="list-decimal list-inside space-y-2 text-grayscale-600">
            <li>Log in to your account and go to My Orders</li>
            <li>Select the order containing the item(s) you wish to return</li>
            <li>Click &quot;Start Return&quot; and select the items</li>
            <li>Choose your refund method and shipping option</li>
            <li>Print your prepaid return label</li>
            <li>
              Pack your items securely and drop off at any carrier location
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-md font-semibold mb-4">Return Shipping</h2>
          <p className="text-grayscale-600 mb-4">
            We offer free return shipping on all orders. Simply use the prepaid
            return label provided when you initiate your return.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-md font-semibold mb-4">Exchanges</h2>
          <p className="text-grayscale-600 mb-4">
            We currently do not offer direct exchanges. To get a different size
            or color, please return your item for a refund and place a new
            order.
          </p>
        </section>

        <section>
          <h2 className="text-md font-semibold mb-4">Questions?</h2>
          <p className="text-grayscale-600">
            If you have any questions about our return policy, please contact
            our customer support team at{" "}
            <a
              href="mailto:support@example.com"
              className="underline font-medium"
            >
              support@example.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
