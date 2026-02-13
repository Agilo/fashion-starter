import {
  addToCart,
  deleteLineItem,
  retrieveCart,
  updateLineItem,
} from "@lib/data/cart"
import { getBaseURL } from "@lib/util/env"
import {
  StoreCart,
  StoreCartLineItem,
  StoreCartPromotion,
} from "@medusajs/types"
import { WebMCPTool, WebMCPToolContext, WebMCPToolResult } from "../types"

interface CartManageInput {
  action: "add" | "remove" | "update" | "view"
  variant_id?: string
  quantity?: number
  line_id?: string
}

interface CartManageData {
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

export const cartManage = async (
  input: CartManageInput,
  context?: WebMCPToolContext
): Promise<WebMCPToolResult<CartManageData>> => {
  const { action, variant_id: variantId, quantity = 1, line_id: lineId } = input
  const pathNameParts = window.location.href
    .replace(getBaseURL(), "")
    .replace(/^\//, "")
    .split("/")
  const countryCode = pathNameParts[0]

  if (!countryCode) {
    return {
      ok: false,
      error: {
        code: "INVALID_COUNTRY_CODE",
        message: "Your country code is invalid.",
      },
    }
  }

  if (action !== "view" && context?.client) {
    const actionConfirmed = await context.client.requestUserInteraction(() =>
      Promise.resolve(
        window.confirm(
          `Confirm cart action: ${action}${
            action === "add" ? ` ${quantity} item(s)` : ""
          }?`
        )
      )
    )

    if (!actionConfirmed) {
      return {
        ok: false,
        error: {
          code: "USER_CANCELLED",
          message: "User cancelled cart action confirmation.",
        },
      }
    }
  }

  switch (action) {
    case "add":
      if (!variantId) {
        return {
          ok: false,
          error: {
            code: "MISSING_VARIANT",
            message: "variant_id is required for add action",
          },
        }
      }

      await addToCart({ variantId, quantity, countryCode })
      break
    case "update":
      if (!lineId) {
        return {
          ok: false,
          error: {
            code: "MISSING_LINE_ID",
            message: "line_id is required for update action",
          },
        }
      }

      await updateLineItem({ lineId, quantity })
      break
    case "remove":
      if (!lineId) {
        return {
          ok: false,
          error: {
            code: "MISSING_LINE_ID",
            message: "line_id is required for remove action",
          },
        }
      }

      await deleteLineItem(lineId)
      break
    case "view":
      break
  }

  const cart = await retrieveCart()

  if (!cart) {
    return {
      ok: false,
      error: {
        code: "CART_MISSING",
        message: "Cart is missing",
      },
    }
  }

  return {
    ok: true,
    data: mapCartToResult(cart),
    meta: {
      tool: "cart.manage",
    },
  }
}

const mapCartToResult = (cart: StoreCart) => {
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

export const cartManageTool: WebMCPTool<CartManageInput, CartManageData> = {
  name: "cart.manage",
  description: "Manage shopping cart (add, remove, update, view)",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["add", "remove", "update", "view"],
        description: "Action to perform",
      },
      variant_id: {
        type: "string",
        description: "Variant ID (required for add)",
      },
      quantity: { type: "number", description: "Quantity (default: 1)" },
      line_id: {
        type: "string",
        description: "Line item ID (required for remove/update)",
      },
    },
    required: ["action"],
    oneOf: [
      {
        properties: {
          action: { const: "add" },
          variant_id: { type: "string" },
        },
        required: ["action", "variant_id"],
      },
      {
        properties: {
          action: { const: "remove" },
          line_id: { type: "string" },
        },
        required: ["action", "line_id"],
      },
      {
        properties: {
          action: { const: "update" },
          line_id: { type: "string" },
        },
        required: ["action", "line_id"],
      },
      {
        properties: {
          action: { const: "view" },
        },
        required: ["action"],
      },
    ],
    additionalProperties: false,
  },
  handler: cartManage,
}
