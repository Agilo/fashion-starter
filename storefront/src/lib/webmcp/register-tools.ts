import { isWebMCPSupported } from "./is-supported"
import { productsSearchTool } from "./tools/products-search"

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
    modelContext.registerTool(productsSearchTool)
    console.log("WebMCP tools registered succesfully")
  } catch (err) {
    console.error("WebMCP registration failed: ", err)
  }
}
