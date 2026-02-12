interface ProductConfigureParams {
  handle: string
  options?: Record<string, string>
}

interface ProductConfigureResult {
  success?: boolean
  variant_id?: string
  selected_options?: Record<string, string>
  error?: {
    code:
      | "AMBIGUOUS_SELECTION"
      | "NO_VARIANT_FOR_SELECTION"
      | "INVALID_COLOR_FOR_MATERIAL"
      | "MATERIAL_REQUIRED"
    message: string
  }
}

const productConfigure = async (
  params: ProductConfigureParams
): Promise<ProductConfigureResult> => {}
