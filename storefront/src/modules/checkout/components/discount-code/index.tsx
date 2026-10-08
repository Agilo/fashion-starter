"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"

import { Form, InputField } from "@/components/Forms"
import { codeFormSchema } from "@modules/cart/components/discount-code"
import { SubmitButton } from "@modules/common/components/submit-button"
import { useApplyPromotions } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart
}

const DiscountCode: React.FC<DiscountCodeProps> = () => {
  const applyPromotions = useApplyPromotions()

  const addPromotionCode = async (values: { code: string }) => {
    if (!values.code) {
      return
    }
    await applyPromotions.mutateAsync([values.code])
  }

  return (
    <Form onSubmit={addPromotionCode} schema={codeFormSchema}>
      <div className="flex max-sm:flex-col gap-x-6 gap-y-4 mb-8">
        <InputField
          name="code"
          inputProps={{ autoFocus: false, className: "max-lg:h-12" }}
          placeholder="Discount code"
          className="flex-1"
        />
        <SubmitButton className="lg:h-auto max-h-14 grow-0 h-12">
          Apply
        </SubmitButton>
      </div>
    </Form>
  )
}

export default withReactQueryProvider(DiscountCode)
