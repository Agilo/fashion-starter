import { WebMCPTool, WebMCPToolResult } from "../types"

export interface NavigateToProductInput {
  handle: string
}

type NavigateToProductData = {
  path: string
}

export const navigateToProduct = async (
  input: NavigateToProductInput,
  context?: {
    router?: {
      push: (href: string) => void
    }
  }
): Promise<WebMCPToolResult<NavigateToProductData>> => {
  const path = `/products/${input.handle}`

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
  description: "Navigate to product detail page",
  annotations: {
    readOnlyHint: true,
  },
  inputSchema: {
    type: "object",
    properties: {
      handle: { type: "string", description: "Product handle/slug" },
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
