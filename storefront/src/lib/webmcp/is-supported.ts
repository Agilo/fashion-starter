interface ModelContext {
  registerTool?: (tool: unknown) => void
}

export const isWebMCPSupported = (): boolean => {
  if (typeof window === "undefined") return false

  const enabled = process.env.NEXT_PUBLIC_ENABLE_WEBMCP === "true"

  if (!enabled) return false

  if (!window.isSecureContext) return false

  const modelContext =
    (document as Document & { modelContext?: ModelContext }).modelContext ||
    (navigator as Navigator & { modelContext?: ModelContext }).modelContext

  return !!modelContext && typeof modelContext.registerTool === "function"
}
