"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"

export const listReturnReasons = async () => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<HttpTypes.StoreReturnReasonListResponse>(`/store/return-reasons`, {
      method: "GET",
      headers,
      next: { tags: ["return-reasons"] },
      cache: "force-cache",
    })
    .then(({ return_reasons }) => return_reasons || [])
    .catch((err) => {
      medusaError(err)
      return []
    })
}
