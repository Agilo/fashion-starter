import { WebMCPTool, WebMCPToolResult } from "../types"

export interface NavigateToProductInput {
  handle: string
  options?: Record<string, string>
}

type NavigateToProductData = {
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
): Promise<WebMCPToolResult<NavigateToProductData>> => {
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
): Promise<WebMCPToolResult<NavigateToProductData>> => {
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

export const navigateToProductTool: WebMCPTool<
  NavigateToProductInput,
  NavigateToProductData
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
  NavigateToProductData
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
