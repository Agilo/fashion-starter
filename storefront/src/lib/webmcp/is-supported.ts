export const isWebMCPSupported = (): boolean => {
  if (typeof window === "undefined") return false

  const enabled = process.env.NEXT_PUBLIC_ENABLE_WEBMCP === "true"

  if (!enabled) return false

  return "modelContext" in navigator
}
