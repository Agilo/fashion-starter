import { isWebMCPSupported } from "./is-supported"
import { ProductSearchInput, productsSearchTool } from "./tools/products-search"

interface Navigator {
  modelContext?: unknown
}

export const registerWebMCPTools = () => {
  if (!isWebMCPSupported()) {
    console.log("WebMCP is not supported, skipping registration")
    return
  }

  const modelContext = (navigator as Navigator).modelContext

  try {
    // TODO: registrirati sve alate ovdje
    const tools = [productsSearchTool]

    tools.forEach((tool) => {
      modelContext.registerTool({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        execute: async (input: ProductSearchInput) => {
          return await productsSearchTool.handler(input)
        },
      })
    })
  } catch (error) {
    console.error("WebMCP registration failed", error)
  }
}
