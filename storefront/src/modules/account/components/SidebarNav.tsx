"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { twJoin } from "tailwind-merge"

import { useCountryCode } from "hooks/country-code"
import { LocalizedLink } from "@/components/LocalizedLink"

export const SidebarNav: React.FC = () => {
  const pathName = usePathname()
  const countryCode = useCountryCode()
  const currentPath = pathName.split(`/${countryCode}`)[1]

  return (
    <>
      <LocalizedLink
        href="/account"
        className={twJoin(
          "flex items-start py-4 max-md:whitespace-nowrap",
          currentPath === "/account" && "font-semibold"
        )}
      >
        Personal &amp; security
      </LocalizedLink>
      <LocalizedLink
        href="/account/my-orders"
        className={twJoin(
          "flex items-start py-4 max-md:whitespace-nowrap",
          currentPath.startsWith("/account/my-orders") && "font-semibold"
        )}
      >
        My orders
      </LocalizedLink>
    </>
  )
}
