import { retrieveCart } from "@lib/data/cart"
import { WebMCPTool, WebMCPToolResult } from "../types"

export interface NavigateToProductInput {
  handle: string
  options?: Record<string, string>
}

type NavigateToResult = {
  path: string
}

const normalizeOptionKey = (key: string) =>
  key.trim().toLowerCase().replace(/\s+/g, "_")

export const navigateToProduct = async (
  input: NavigateToProductInput,
  context?: {
    router?: {
      push: (href: string) => void
    }
  }
): Promise<WebMCPToolResult<NavigateToResult>> => {
  const normalizedOptionKeys = new Set(
    Object.keys(input.options ?? {}).map((key) => normalizeOptionKey(key))
  )

  const hasColor = normalizedOptionKeys.has("color")
  const hasMaterial = normalizedOptionKeys.has("material")

  if (hasColor && !hasMaterial) {
    return {
      ok: false,
      error: {
        code: "MATERIAL_REQUIRED",
        message:
          "Material must be provided when Color is set. Example: { Material: 'Leather', Color: 'Red' }.",
      },
    }
  }

  const queryParams = new URLSearchParams()

  Object.entries(input.options ?? {}).forEach(([key, value]) => {
    if (!key.trim() || !value.trim()) {
      return
    }

    const normalizedKey = normalizeOptionKey(key)
    queryParams.set(`mcp_opt_${normalizedKey}`, value)
  })

  const path = `/products/${input.handle}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`

  try {
    context?.router?.push(path)

    return {
      ok: true,
      data: {
        path,
      },
      meta: {
        tool: "navigation.toProduct",
      },
    }
  } catch (error) {
    console.error(error)
    return {
      ok: false,
      error: {
        code: "NAVIGATION_FAILED",
        message: "Failed to navigate to product",
      },
    }
  }
}

export const navigateToCart = async (
  _input: Record<string, never>,
  context?: {
    router?: {
      push: (href: string) => void
    }
  }
): Promise<WebMCPToolResult<NavigateToResult>> => {
  const path = "/cart"

  try {
    context?.router?.push(path)

    return {
      ok: true,
      data: {
        path,
      },
      meta: {
        tool: "navigation.toCart",
      },
    }
  } catch (error) {
    console.error(error)
    return {
      ok: false,
      error: {
        code: "NAVIGATION_FAILED",
        message: "Failed to navigate to cart",
      },
    }
  }
}

export const checkoutPrepare = async (
  _input: Record<string, never>,
  context?: {
    router?: {
      push: (href: string) => void
    }
  }
): Promise<WebMCPToolResult<NavigateToResult>> => {
  const path = "/checkout"

  try {
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

    if (!cart.items || cart.items.length < 1) {
      return {
        ok: false,
        error: {
          code: "CART_EMPTY",
          message: "Cart is empty",
        },
      }
    }

    context?.router?.push(path)

    return {
      ok: true,
      data: { path },
      meta: { tool: "checkout.prepare" },
    }
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "CHECKOUT_PREPARE_FAILED",
        message: "Failed to prepare checkout",
      },
    }
  }
}

export const navigateToProductTool: WebMCPTool<
  NavigateToProductInput,
  NavigateToResult
> = {
  name: "navigation.toProduct",
  description:
    "Navigate to product detail page, optionally preselect options. For products with Material and Color, Material must be set before Color.",
  annotations: {
    readOnlyHint: true,
  },
  inputSchema: {
    type: "object",
    properties: {
      handle: { type: "string", description: "Product handle/slug" },
      options: {
        type: "object",
        description:
          "Optional option map like { Material: 'Cotton', Size: 'M' }. If providing Color, also provide Material.",
        additionalProperties: { type: "string" },
      },
    },
    required: ["handle"],
    additionalProperties: false,
  },
  handler: navigateToProduct,
}

export const navigateToCartTool: WebMCPTool<
  Record<string, never>,
  NavigateToResult
> = {
  name: "navigation.toCart",
  description: "Navigate to shopping cart page",
  annotations: {
    readOnlyHint: true,
  },
  inputSchema: {
    type: "object",
    properties: {},
    additionalProperties: false,
  },
  handler: navigateToCart,
}

export const checkoutPrepareTool: WebMCPTool<
  Record<string, never>,
  NavigateToResult
> = {
  name: "checkout.prepare",
  description:
    "Validate that the shopping cart has items and navigate to the checkout page. Performs pre-checkout validation (checks cart exists and is not empty) before proceeding. Returns error if cart is missing or empty.",
  annotations: {
    readOnlyHint: false,
  },
  inputSchema: {
    type: "object",
    properties: {},
    additionalProperties: false,
  },
  handler: checkoutPrepare,
}
