interface NavigateToProductInput {
  handle: string
}

export const navigateToProduct = async (input: NavigateToProductInput) => {
  try {
    window.location.href = `/products/${input.handle}`
    return { success: true }
  } catch (error) {
    return {
      error: {
        code: "NAVIGATION_FAILED",
        message: "Failed to navigate to product",
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
