import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export interface NavigateToProductInput {
  handle: string
}

export const navigateToProduct = async (
  input: NavigateToProductInput,
  router?: AppRouterInstance
) => {
  try {
    if (router) router.push(`/products/${input.handle}`)
    return { success: true }
  } catch (error) {
    console.error(error)
    return {
      error: {
        code: "NAVIGATION_FAILED",
        message: "Failed to navigate to product",
      },
    }
  }
}

export const navigateToCart = async (
  input: Record<string, never>,
  router?: AppRouterInstance
) => {
  try {
    if (router) router.push("/cart")
    return { success: true }
  } catch (error) {
    console.error(error)
    return {
      error: {
        code: "NAVIGATION_FAILED",
        message: "Failed to navigate to cart",
      },
    }
  }
}

export const navigateToProductTool = {
  name: "navigate_to_product",
  description: "Navigate to product detail page",
  inputSchema: {
    type: "object",
    properties: {
      handle: { type: "string", description: "Product handle/slug" },
    },
    required: ["handle"],
  },
  handler: navigateToProduct,
}

export const navigateToCartTool = {
  name: "navigate_to_cart",
  description: "Navigate to shopping cart page",
  inputSchema: {
    type: "object",
    properties: {},
  },
  handler: navigateToCart,
}
