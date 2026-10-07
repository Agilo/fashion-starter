"use client"

import * as React from "react"
import { Icon } from "@/components/Icon"
import { LocalizedButtonLink } from "@/components/LocalizedLink"
import { withReactQueryProvider } from "@lib/util/react-query"
import { useCustomer } from "hooks/customer"

const LoginLink = ({ className }: { className: string }) => {
  const { data: customer } = useCustomer()
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => setIsMounted(true), [])

  return (
    <LocalizedButtonLink
      href={isMounted && customer ? "/account" : "/auth/login"}
      prefetch={false}
      variant="ghost"
      className={className}
      aria-label="Open account"
    >
      <Icon name="user" className="w-6 h-6" />
    </LocalizedButtonLink>
  )
}

export default withReactQueryProvider(LoginLink)
