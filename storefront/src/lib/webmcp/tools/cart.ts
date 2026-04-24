import {
  addToCart,
  deleteLineItem,
  retrieveCart,
  updateLineItem,
} from "@lib/data/cart"
import {
  CartSnapshot,
  WebMCPTool,
  WebMCPToolContext,
  WebMCPToolResult,
} from "../types"
import { mapCartToResult } from "../utils"

interface CartManageInput {
  action: "add" | "remove" | "update" | "view"
  variant_id?: string
  quantity?: number
  line_id?: string
}

export const cartManage = async (
  input: CartManageInput,
  context?: WebMCPToolContext
): Promise<WebMCPToolResult<CartSnapshot>> => {
  const { action, variant_id: variantId, quantity, line_id: lineId } = input
  const addQuantity = action === "add" ? (quantity ?? 1) : quantity
  const pathNameParts = window.location.pathname.replace(/^\//, "").split("/")
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
            action === "add" ? ` ${addQuantity} item(s)` : ""
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

  try {
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

        await addToCart({ variantId, quantity: addQuantity, countryCode })
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
        if (quantity === undefined) {
          return {
            ok: false,
            error: {
              code: "MISSING_QUANTITY",
              message: "quantity is required for update action",
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
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to perform cart action"

    return {
      ok: false,
      error: {
        code: "CART_OPERATION_FAILED",
        message,
      },
    }
  }
}

export const cartManageTool: WebMCPTool<CartManageInput, CartSnapshot> = {
  name: "cart.manage",
  description: "Manage shopping cart (add, remove, update, view)",
  annotations: {
    readOnlyHint: false,
    untrustedContentHint: true,
  },
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
      quantity: {
        type: "number",
        description:
          "Quantity for the action. Optional for add (defaults to 1), required for update.",
      },
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
