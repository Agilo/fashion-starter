import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { isWebMCPSupported } from "./is-supported"
import { navigateToCartTool, navigateToProductTool } from "./tools/checkout"
import { productsSearchTool } from "./tools/products-search"
import { cartManageTool } from "./tools/cart"
import { WebMCPClient } from "./types"

interface Navigator extends globalThis.Navigator {
  modelContext: {
    provideContext: (options?: {
      tools?: Array<{
        name: string
        description: string
        inputSchema: object
        execute: (input: unknown, client: WebMCPClient) => Promise<unknown>
        annotations?: {
          readOnlyHint?: boolean
        }
      }>
    }) => void
    clearContext: () => void
    registerTool: (tool: {
      name: string
      description: string
      inputSchema: object
      execute: (input: unknown, client: WebMCPClient) => Promise<unknown>
      annotations?: {
        readOnlyHint?: boolean
      }
    }) => void
    unregisterTool: (name: string) => void
  }
}

export const registerWebMCPTools = (router?: AppRouterInstance) => {
  if (!isWebMCPSupported()) {
    console.info("WebMCP is not supported, skipping registration")
    return
  }

  const modelContext = (navigator as unknown as Navigator).modelContext

  try {
    type RegisterableWebMCPTool = {
      name: string
      description: string
      inputSchema: object
      annotations?: {
        readOnlyHint?: boolean
      }
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
    ] as RegisterableWebMCPTool[]

    modelContext.provideContext({
      tools: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: tool.annotations,
        execute: async (input, client) => {
          return await tool.handler(input, { router, client })
        },
      })),
    })
  } catch (error) {
    console.error("WebMCP registration failed", error)
  }
}
