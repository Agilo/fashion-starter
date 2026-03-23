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

export interface CartSnapshot {
  cart: {
    id: string
    currency_code: string
    subtotal: number
    total: number
    discount_total?: number
    items: Array<{
      id: string
      title: string
      variant_id: string
      quantity: number
      unit_price: number
      total: number
    }>
    discount_codes?: string[]
  }
}
