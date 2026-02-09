"use client"

import * as React from "react"
import { z } from "zod"
import { Icon } from "@/components/Icon"
import { Button } from "@/components/Button"
import { Form, InputField } from "@/components/Forms"
import { LocalizedLink } from "@/components/LocalizedLink"
import { Layout } from "@/components/Layout"

const guestAccessSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  email: z.string().email("Please enter a valid email address"),
})

type GuestAccessFormValues = z.infer<typeof guestAccessSchema>

type GuestReturnsTemplateProps = {
  onOrderFound?: (orderId: string, email: string) => void
}

export const GuestReturnsTemplate: React.FC<GuestReturnsTemplateProps> = ({
  onOrderFound,
}) => {
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (values: GuestAccessFormValues) => {
    setError(null)
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, always succeed
    // In real implementation, this would verify the order exists
    setIsLoading(false)

    if (onOrderFound) {
      onOrderFound(values.orderId, values.email)
    }
  }

  return (
    <Layout className="py-16 min-h-screen items-center">
      <div className="col-span-full md:col-span-6 xl:col-start-2 xl:col-end-7">
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold mb-2">Create Return</h1>
        </div>
        <Form schema={guestAccessSchema} onSubmit={handleSubmit}>
          <InputField
            name="orderId"
            placeholder="Order ID"
            inputProps={{ uiSize: "lg" }}
            className="mb-4"
          />
          <InputField
            name="email"
            type="email"
            placeholder="Email address used for order"
            inputProps={{ uiSize: "lg" }}
            className="mb-6"
          />
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xs text-sm">
              <Icon name="info" className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          <Button
            type="submit"
            isFullWidth
            isLoading={isLoading}
            loadingText="Looking up order..."
          >
            Find My Order
          </Button>
        </Form>
        <div className="mt-8 text-center text-grayscale-500">
          <p>
            Have an account?{" "}
            <LocalizedLink href="/auth/login" className="underline font-medium">
              Log in
            </LocalizedLink>{" "}
            to access all your orders.
          </p>
        </div>
      </div>

      {/* Track Existing Return */}
      <div className="max-md:mt-8 col-span-full md:col-start-8 md:col-end-13 xl:col-end-12 text-center">
        <p className="text-sm text-grayscale-500 mb-4">
          Already submitted a return?
        </p>
        <LocalizedLink
          href="/returns/track"
          className="inline-flex items-center gap-2 text-sm font-medium border-b border-current"
        >
          Track Your Return
          <Icon name="arrow-right" className="w-4 h-4" />
        </LocalizedLink>
      </div>
    </Layout>
  )
}
