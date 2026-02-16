import { applyPromotions, removePromotions, retrieveCart } from "@lib/data/cart"
import {
  StoreCart,
  StoreCartLineItem,
  StoreCartPromotion,
} from "@medusajs/types"
import { WebMCPTool, WebMCPToolResult } from "../types"

interface PromotionInput {
  code: string
}

interface CartData {
  cart: {
    id: string
    currency_code: string
    subtotal: number
    total: number
    discount_total?: number
    items: Array<{
      id: string
      title: string
      variant_id: string
      quantity: number
      unit_price: number
      total: number
    }>
    discount_codes?: string[]
  }
}

export const cartApplyPromotion = async (
  input: PromotionInput
): Promise<WebMCPToolResult<CartData>> => {
  if (!input.code) {
    return {
      ok: false,
      error: {
        code: "MISSING_CODE",
        message: "Promotion code is required",
      },
    }
  }

  try {
    await applyPromotions([input.code])

    const cart = await retrieveCart()

    if (!cart) {
      return {
        ok: false,
        error: {
          code: "CART_MISSING",
          message: "No active cart found",
        },
      }
    }

    return {
      ok: true,
      data: mapCartToResult(cart),
      meta: {
        tool: "cart.applyPromotion",
      },
    }
  } catch (error) {
    console.error("[cartApplyPromotion] Error:", error)
    return {
      ok: false,
      error: {
        code: "APPLY_FAILED",
        message:
          error instanceof Error
            ? error.message
            : "Failed to apply promotion code",
      },
    }
  }
}

export const cartRemovePromotion = async (
  input: PromotionInput
): Promise<WebMCPToolResult<CartData>> => {
  if (!input.code) {
    return {
      ok: false,
      error: {
        code: "MISSING_CODE",
        message: "Promotion code is required",
      },
    }
  }

  try {
    await removePromotions([input.code])

    const cart = await retrieveCart()

    if (!cart) {
      return {
        ok: false,
        error: {
          code: "CART_MISSING",
          message: "No active cart found",
        },
      }
    }

    return {
      ok: true,
      data: mapCartToResult(cart),
      meta: {
        tool: "cart.removePromotion",
      },
    }
  } catch (error) {
    console.error("[cartRemovePromotion] Error:", error)
    return {
      ok: false,
      error: {
        code: "REMOVE_FAILED",
        message:
          error instanceof Error
            ? error.message
            : "Failed to remove promotion code",
      },
    }
  }
}

const mapCartToResult = (cart: StoreCart): CartData => {
  return {
    cart: {
      id: cart.id,
      currency_code: cart.currency_code,
      subtotal: cart.subtotal ?? 0,
      total: cart.total ?? 0,
      discount_total: cart.discount_total,
      items:
        cart.items?.map((item: StoreCartLineItem) => ({
          id: item.id,
          title: item.title,
          variant_id: item.variant_id ?? "",
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total ?? 0,
        })) || [],
      discount_codes:
        cart.promotions
          ?.map((p: StoreCartPromotion) => p.code)
          .filter((code): code is string => code !== undefined) || [],
    },
  }
}

export const applyPromotionTool: WebMCPTool<PromotionInput, CartData> = {
  name: "cart.applyPromotion",
  description:
    "Apply a discount/promotion code to the shopping cart. Returns updated cart with applied discount, including new subtotal, total, and discount amount. Common error codes: INVALID_CODE (code doesn't exist), NOT_APPLICABLE (code not valid for current cart items), EXPIRED (code has expired).",
  annotations: {
    readOnlyHint: false,
  },
  inputSchema: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description:
          "Promotion/discount code to apply (e.g., 'SUMMER25', 'FREESHIP')",
      },
    },
    additionalProperties: false,
    required: ["code"],
  },
  handler: cartApplyPromotion,
}

export const removePromotionTool: WebMCPTool<PromotionInput, CartData> = {
  name: "cart.removePromotion",
  description:
    "Remove a previously applied discount/promotion code from the shopping cart. Returns updated cart with recalculated totals after discount removal. Use this when the user wants to replace a code or remove an applied discount.",
  annotations: {
    readOnlyHint: false,
  },
  inputSchema: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description:
          "Promotion/discount code to remove (must match an applied code)",
      },
    },
    additionalProperties: false,
    required: ["code"],
  },
  handler: cartRemovePromotion,
}
