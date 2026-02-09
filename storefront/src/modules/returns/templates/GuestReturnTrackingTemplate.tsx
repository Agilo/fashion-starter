"use client"

import * as React from "react"
import { z } from "zod"
import { Icon } from "@/components/Icon"
import { Button } from "@/components/Button"
import { Form, InputField } from "@/components/Forms"
import { LocalizedLink } from "@/components/LocalizedLink"
import { Layout } from "@/components/Layout"

const trackingSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  email: z.string().email("Please enter a valid email address"),
})

type TrackingFormValues = z.infer<typeof trackingSchema>

type GuestReturnTrackingTemplateProps = {
  onReturnFound?: (orderId: string, email: string) => void
}

export const GuestReturnTrackingTemplate: React.FC<
  GuestReturnTrackingTemplateProps
> = ({ onReturnFound }) => {
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (values: TrackingFormValues) => {
    setError(null)
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)

    if (onReturnFound) {
      onReturnFound(values.orderId, values.email)
    }
  }

  return (
    <Layout className="py-16 min-h-screen items-center">
      <div className="col-span-full md:col-span-6 xl:col-start-2 xl:col-end-7">
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold mb-2">Track Your Return</h1>
        </div>
        <Form schema={trackingSchema} onSubmit={handleSubmit}>
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
            to track your returns.
          </p>
        </div>
      </div>
      <div className="max-md:mt-8 col-span-full md:col-start-8 md:col-end-13 xl:col-end-12 text-center">
        <p className="text-sm text-grayscale-500 mb-4">
          Want to start a new return?
        </p>
        <LocalizedLink
          href="/returns"
          className="inline-flex items-center gap-2 text-sm font-medium border-b border-current"
        >
          Start a Return
          <Icon name="arrow-right" className="w-4 h-4" />
        </LocalizedLink>
      </div>
    </Layout>
  )
}
