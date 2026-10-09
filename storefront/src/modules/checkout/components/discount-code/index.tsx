"use client"

import React from "react"
import { UseFormReturn } from "react-hook-form"
import { HttpTypes } from "@medusajs/types"

import { Form, InputField } from "@/components/Forms"
import { codeFormSchema } from "@modules/cart/components/discount-code"
import { SubmitButton } from "@modules/common/components/submit-button"
import { useApplyPromotions } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"
import { AppliedPromotions } from "@modules/cart/components/applied-promotions"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
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
    <div className="mb-8">
      <Form onSubmit={addPromotionCode} schema={codeFormSchema}>
        <div className="flex max-sm:flex-col gap-x-6 gap-y-4">
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
      {error && <p className="text-red-primary text-xs mt-2">{error}</p>}
      <AppliedPromotions cart={cart} />
    </div>
  )
}

export default withReactQueryProvider(DiscountCode)
