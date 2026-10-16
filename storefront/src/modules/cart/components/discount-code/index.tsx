"use client"

import React from "react"
import { UseFormReturn } from "react-hook-form"
import { HttpTypes } from "@medusajs/types"

import { Form, InputField } from "@/components/Forms"
import { twMerge } from "tailwind-merge"
import { SubmitButton } from "@modules/common/components/submit-button"
import { z } from "zod"
import { useApplyPromotions } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"
import { AppliedPromotions } from "@modules/cart/components/applied-promotions"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart
  className?: string
}

export const codeFormSchema = z.object({
  code: z.string().min(1),
})

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart, className }) => {
  const applyPromotions = useApplyPromotions()

  const addPromotionCode = async (
    values: { code: string },
    form: UseFormReturn<{ code: string }>
  ) => {
    if (!values.code) {
      return
    }
    const result = await applyPromotions
      .mutateAsync([values.code])
      .catch(() => null)

    if (result && !result.error) {
      form.reset({ code: "" })
    }
  }

  const error =
    applyPromotions.data?.error ??
    (applyPromotions.isError
      ? "Couldn't apply the code. Please try again."
      : null)

  return (
    <>
      <Form onSubmit={addPromotionCode} schema={codeFormSchema}>
        <div className={twMerge("flex gap-2 mt-10", className)}>
          <InputField
            name="code"
            inputProps={{ autoFocus: false, uiSize: "md" }}
            placeholder="Discount code"
            className="flex flex-1 flex-col"
          />
          <SubmitButton>Apply</SubmitButton>
        </div>
      </Form>
      {error && <p className="text-red-primary text-xs mt-2">{error}</p>}
      <AppliedPromotions cart={cart} />
    </>
  )
}

export default withReactQueryProvider(DiscountCode)
