"use client"

import * as React from "react"
import { z } from "zod"
import { Icon } from "@/components/Icon"
import { Button } from "@/components/Button"
import { Form, InputField } from "@/components/Forms"
import { LocalizedLink } from "@/components/LocalizedLink"
import { Layout } from "@/components/Layout"
import { verifyGuestOrderAccess } from "@lib/data/returns"

const guestAccessSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  email: z.email("Please enter a valid email address"),
})

type FormData = z.infer<typeof guestAccessSchema>

export const GuestReturnCreateForm: React.FC = () => {
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (data: FormData) => {
    setError(null)
    setIsLoading(true)

    try {
      await verifyGuestOrderAccess(data.orderId, data.email)
    } catch (err) {
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
        return
      }

      setError(
        err instanceof Error
          ? err.message
          : "Unable to find order. Please check your details and try again."
      )
      setIsLoading(false)
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
          {error && <p className="text-red-primary text-sm mb-6">{error}</p>}
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
            to create returns faster.
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
