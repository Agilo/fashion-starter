"use client"

import * as React from "react"
import { Form, InputField } from "@/components/Forms"
import { SubmitButton } from "@modules/common/components/submit-button"
import { forgotPassword } from "@lib/data/customer"
import { LocalizedButtonLink } from "@/components/LocalizedLink"
import { z } from "zod"

const forgotPasswordFormSchema = z.object({
  email: z.email(),
})

export const ForgotPasswordForm: React.FC = () => {
  const [formState, formAction] = React.useActionState(forgotPassword, {
    state: "initial",
  })

  const onSubmit = (values: z.infer<typeof forgotPasswordFormSchema>) => {
    React.startTransition(() => {
      formAction(values)
    })
  }

  if (formState.state === "success") {
    return (
      <>
        <h1 className="text-xl md:text-2xl mb-8">
          Your password is waiting for you!
        </h1>
        <div className="mb-8">
          <p>
            We&apos;ve sent you an email with further instructions on retrieving
            your account.
          </p>
        </div>
        <LocalizedButtonLink href="/" isFullWidth>
          Back to home page
        </LocalizedButtonLink>
      </>
    )
  }

  return (
    <Form onSubmit={onSubmit} schema={forgotPasswordFormSchema}>
      <h1 className="text-xl md:text-2xl mb-8">Forgot password?</h1>
      <div className="mb-8">
        <p>
          Enter your email address below and we will send you instructions on
          how to reset your password.
        </p>
      </div>
      <InputField
        placeholder="Email"
        name="email"
        className="flex-1 mb-8"
        type="email"
      />
      {formState.state === "error" && (
        <p className="text-red-primary text-sm">{formState.error}</p>
      )}
      <SubmitButton isFullWidth>Reset your password</SubmitButton>
    </Form>
  )
}
