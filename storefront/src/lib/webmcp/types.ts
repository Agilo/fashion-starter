import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export interface WebMCPClient {
  requestUserInteraction: <T>(callback: () => Promise<T> | T) => Promise<T>
}

export interface WebMCPToolContext {
  router?: AppRouterInstance
  client?: WebMCPClient
}

export type WebMCPToolResult<TData> =
  | {
      ok: true
      data: TData
      meta: {
        tool: string
      }
    }
  | {
      ok: false
      error: {
        code: string
        message: string
      }
    }

export interface WebMCPTool<TInput, TData> {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  annotations?: {
    readOnlyHint?: boolean
  }
  handler: (
    input: TInput,
    context?: WebMCPToolContext
  ) => Promise<WebMCPToolResult<TData>>
}
