import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { isWebMCPSupported } from "./is-supported"
import { navigateToCartTool, navigateToProductTool } from "./tools/checkout"
import { productsSearchTool } from "./tools/products-search"
import { cartManageTool } from "./tools/cart"

interface Navigator {
  modelContext?: unknown
}

export const registerWebMCPTools = (router?: AppRouterInstance) => {
  if (!isWebMCPSupported()) {
    console.log("WebMCP is not supported, skipping registration")
    return
  }

  const modelContext = (navigator as Navigator).modelContext

  try {
    // TODO: registrirati sve alate ovdje
    const tools = [
      productsSearchTool,
      navigateToProductTool,
      navigateToCartTool,
      cartManageTool,
    ]

    tools.forEach((tool) => {
      modelContext.registerTool({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        execute: async (input: any) => {
          return await tool.handler(input, router)
        },
      })
    })
  } catch (error) {
    console.error("WebMCP registration failed", error)
  }
}
