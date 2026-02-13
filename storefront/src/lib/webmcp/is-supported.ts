export const isWebMCPSupported = (): boolean => {
  if (typeof window === "undefined") return false

  const enabled = process.env.NEXT_PUBLIC_ENABLE_WEBMCP === "true"

  if (!enabled) return false

  if (!window.isSecureContext) return false

  const nav = navigator as Navigator & {
    modelContext?: {
      provideContext?: (options?: { tools?: unknown[] }) => void
    }
  }

  return (
    !!nav.modelContext && typeof nav.modelContext.provideContext === "function"
  )
}
