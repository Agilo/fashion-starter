import {
  addToCart,
  applyPromotions,
  deleteLineItem,
  getCartQuantity,
  getPaymentMethod,
  initiatePaymentSession,
  placeOrder,
  retrieveCart,
  setAddresses,
  setEmail,
  setPaymentMethod,
  setShippingMethod,
  updateLineItem,
  updateRegion,
} from "@lib/data/cart"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { z } from "zod"

export const useCart = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await retrieveCart()
      return res
    },
    enabled,
  })
}

export const useCartQuantity = () => {
  return useQuery({
    queryKey: ["cart", "cart-quantity"],
    queryFn: async () => {
      const res = await getCartQuantity()
      return res
    },
  })
}

export const useCartShippingMethods = (cartId: string) => {
  return useQuery({
    queryKey: [cartId],
    queryFn: async () => {
      const res = await listCartShippingMethods(cartId)
      return res
    },
  })
}

export const useCartPaymentMethods = (regionId: string) => {
  return useQuery({
    queryKey: [regionId],
    queryFn: async () => {
      const res = await listCartPaymentMethods(regionId)
      return res
    },
  })
}

export const useUpdateLineItem = (
  options?: UseMutationOptions<
    void,
    Error,
    { lineId: string; quantity: number },
    unknown
  >
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["cart-update-line-item"],
    mutationFn: async (payload: { lineId: string; quantity: number }) => {
      const response = await updateLineItem({
        lineId: payload.lineId,
        quantity: payload.quantity,
      })
      return response
    },
    async onSuccess(...args) {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["cart"],
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useDeleteLineItem = (
  options?: UseMutationOptions<void, Error, { lineId: string }, unknown>
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["cart-delete-line-item"],
    mutationFn: async (payload: { lineId: string }) => {
      const response = await deleteLineItem(payload.lineId)

      return response
    },
    async onSuccess(...args) {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["cart"],
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useAddLineItem = (
  options?: UseMutationOptions<
    void,
    Error,
    { variantId: string; quantity: number; countryCode: string | undefined },
    unknown
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["cart-add-line-item"],
    mutationFn: async (payload: {
      variantId: string
      quantity: number
      countryCode: string | undefined
    }) => {
      const response = await addToCart({ ...payload })

      return response
    },
    async onSuccess(...args) {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["cart"],
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useSetShippingMethod = (
  { cartId }: { cartId: string },
  options?: UseMutationOptions<
    void,
    Error,
    { shippingMethodId: string },
    unknown
  >
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["shipping-update", cartId],
    mutationFn: async ({ shippingMethodId }) => {
      const response = await setShippingMethod({
        cartId,
        shippingMethodId,
      })

      return response
    },
    async onSuccess(...args) {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["cart"],
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const addressesFormSchema = z
  .object({
    shipping_address: z.object({
      first_name: z.string().min(1),
      last_name: z.string().min(1),
      company: z.string().optional(),
      address_1: z.string().min(1),
      address_2: z.string().optional(),
      city: z.string().min(1),
      postal_code: z.string().min(1),
      province: z.string().optional(),
      country_code: z.string().min(2),
      phone: z.string().optional(),
    }),
  })
  .and(
    z.discriminatedUnion("same_as_billing", [
      z.object({
        same_as_billing: z.literal("on"),
      }),
      z.object({
        same_as_billing: z.literal("off").optional(),
        billing_address: z.object({
          first_name: z.string().min(1),
          last_name: z.string().min(1),
          company: z.string().optional(),
          address_1: z.string().min(1),
          address_2: z.string().optional(),
          city: z.string().min(1),
          postal_code: z.string().min(1),
          province: z.string().optional(),
          country_code: z.string().min(2),
          phone: z.string().optional(),
        }),
      }),
    ])
  )

export const useSetShippingAddress = (
  options?: UseMutationOptions<
    { success: boolean; error: string | null },
    Error,
    z.infer<typeof addressesFormSchema>,
    unknown
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["shipping-address-update"],
    mutationFn: async (payload) => {
      const response = await setAddresses(payload)
      return response
    },
    async onSuccess(...args) {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["cart"],
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useSetEmail = (
  options?: UseMutationOptions<
    { success: boolean; error: string | null },
    Error,
    { email: string; country_code: string },
    unknown
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["set-email"],
    mutationFn: async (payload) => {
      const response = await setEmail(payload)
      return response
    },
    async onSuccess(...args) {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["cart"],
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useInitiatePaymentSession = (
  options?: UseMutationOptions<
    HttpTypes.StorePaymentCollectionResponse,
    Error,
    {
      providerId: string
    },
    unknown
  >
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["initiate-payment"],
    mutationFn: async (payload: { providerId: string }) => {
      const response = await initiatePaymentSession(payload.providerId)

      return response
    },
    async onSuccess(...args) {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["cart"],
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useSetPaymentMethod = (
  options?: UseMutationOptions<
    void,
    Error,
    { sessionId: string; token: string | null | undefined },
    unknown
  >
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["set-payment"],
    mutationFn: async (payload) => {
      const response = await setPaymentMethod(payload.sessionId, payload.token)

      return response
    },
    async onSuccess(...args) {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["cart"],
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useGetPaymentMethod = (id: string | undefined) => {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: async () => {
      if (!id) {
        return null
      }
      const res = await getPaymentMethod(id)
      return res
    },
  })
}

export const usePlaceOrder = (
  options?: UseMutationOptions<
    | {
        type: "cart"
        cart: HttpTypes.StoreCart
        error: {
          message: string
          name: string
          type: string
        }
      }
    | {
        type: "order"
        order: HttpTypes.StoreOrder
      }
    | null,
    Error,
    null,
    unknown
  >
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["place-order"],
    mutationFn: async () => {
      const response = await placeOrder()
      return response
    },
    ...options,
    async onSuccess(...args) {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["cart"],
      })

      await options?.onSuccess?.(...args)
    },
  })
}

export const useApplyPromotions = (
  options?: UseMutationOptions<void, Error, string[], unknown>
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["apply-promotion"],
    mutationFn: async (payload) => {
      const response = await applyPromotions(payload)

      return response
    },
    async onSuccess(...args) {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["cart"],
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useUpdateRegion = (
  options?: UseMutationOptions<
    void,
    Error,
    { countryCode: string; currentPath: string },
    unknown
  >
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["update-region"],
    mutationFn: async ({ countryCode, currentPath }) => {
      await updateRegion(countryCode, currentPath)
    },
    async onSuccess(...args) {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["cart"],
      })
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["regions"],
      })
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["products"],
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}
