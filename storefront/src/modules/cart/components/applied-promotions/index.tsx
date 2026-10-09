"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import { twJoin, twMerge } from "tailwind-merge"

import { Icon } from "@/components/Icon"
import { useRemovePromotions } from "hooks/cart"

type AppliedPromotionsProps = {
  cart: HttpTypes.StoreCart
  className?: string
}

export const AppliedPromotions: React.FC<AppliedPromotionsProps> = ({
  cart,
  className,
}) => {
  const removePromotions = useRemovePromotions()

  const promotions = (cart.promotions ?? []).filter(
    (promotion): promotion is typeof promotion & { code: string } =>
      !!promotion.code
  )

  if (!promotions.length) {
    return null
  }

  return (
    <ul
      aria-label="Applied discount codes"
      className={twMerge("flex flex-wrap gap-2 mt-4", className)}
    >
      {promotions.map((promotion) => (
        <li
          key={promotion.id}
          className={twJoin(
            "inline-flex items-center gap-2 h-8 pl-2.5 rounded-xs text-xs bg-white border border-grayscale-200",
            promotion.is_automatic ? "pr-2.5" : "pr-0.5"
          )}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-900 shrink-0"
            aria-hidden="true"
          >
            <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
            <circle cx="7.5" cy="7.5" r="1.5" />
          </svg>
          <span className="font-semibold">{promotion.code}</span>
          {!promotion.is_automatic && (
            <button
              type="button"
              aria-label={`Remove ${promotion.code}`}
              onClick={() => removePromotions.mutate([promotion.code])}
              disabled={removePromotions.isPending}
              className="w-7 h-7 flex items-center justify-center text-grayscale-500 hover:text-black disabled:opacity-50"
            >
              <Icon name="close" className="w-3.5 h-3.5" />
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
