"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"

import { Form, InputField } from "@/components/Forms"
import { twMerge } from "tailwind-merge"
import { SubmitButton } from "@modules/common/components/submit-button"
import { z } from "zod"
import { useApplyPromotions } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart
  className?: string
}

export const codeFormSchema = z.object({
  code: z.string().min(1),
})

const DiscountCode: React.FC<DiscountCodeProps> = ({ className }) => {
  const applyPromotions = useApplyPromotions()

  const addPromotionCode = async (values: { code: string }) => {
    if (!values.code) {
      return
    }
    await applyPromotions.mutateAsync([values.code])
  }

  return (
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
  )
}

export default withReactQueryProvider(DiscountCode)
