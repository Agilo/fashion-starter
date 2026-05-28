import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { isWebMCPSupported } from "./is-supported"
import {
  checkoutPrepareTool,
  navigateToCartTool,
  navigateToProductTool,
} from "./tools/checkout"
import { productsSearchTool } from "./tools/products-search"
import { cartManageTool } from "./tools/cart"
import { WebMCPClient, WebMCPToolAnnotations } from "./types"
import { applyPromotionTool, removePromotionTool } from "./tools/promotion"

interface ModelContext {
  registerTool: (
    tool: {
      name: string
      description: string
      inputSchema: object
      execute: (input: unknown, client: WebMCPClient) => Promise<unknown>
      annotations?: WebMCPToolAnnotations
    },
    options?: { signal?: AbortSignal }
  ) => void
  unregisterTool?: (name: string) => void
}

interface DocumentWithModelContext extends globalThis.Document {
  modelContext?: ModelContext
}

interface NavigatorWithModelContext extends globalThis.Navigator {
  modelContext?: ModelContext
}

export const registerWebMCPTools = (router?: AppRouterInstance) => {
  if (!isWebMCPSupported()) {
    console.info("WebMCP is not supported, skipping registration")
    return () => {}
  }

  const modelContext =
    (document as DocumentWithModelContext).modelContext ||
    (navigator as NavigatorWithModelContext).modelContext

  if (!modelContext) {
    console.info("modelContext unavailable, skipping registration")
    return () => {}
  }

  const controller = new AbortController()

  try {
    type RegisterableWebMCPTool = {
      name: string
      description: string
      inputSchema: object
      annotations?: WebMCPToolAnnotations
      handler: (
        input: unknown,
        context?: {
          router?: AppRouterInstance
          client?: WebMCPClient
        }
      ) => Promise<unknown>
    }

    const tools: RegisterableWebMCPTool[] = [
      productsSearchTool,
      navigateToProductTool,
      navigateToCartTool,
      cartManageTool,
      applyPromotionTool,
      removePromotionTool,
      checkoutPrepareTool,
    ] as RegisterableWebMCPTool[]

    tools.forEach((tool) => {
      modelContext.registerTool(
        {
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          annotations: tool.annotations,
          execute: async (input, client) => {
            return await tool.handler(input, { router, client })
          },
        },
        { signal: controller.signal }
      )
    })
  } catch (error) {
    console.error("WebMCP registration failed", error)
  }

  return () => controller.abort()
}
